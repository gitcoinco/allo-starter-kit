import {
  PublicClient,
  encodePacked,
  getAddress,
  publicActions,
  keccak256,
  zeroAddress,
  WalletClient,
  encodeAbiParameters,
  parseAbiParameters,
} from "viem";
import { API } from "../../types";
import { Allo, Registry } from "@allo-team/allo-v2-sdk/";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";

import { decodeEventLog, type Address, type Chain } from "viem";

const createAlloOpts = (chain: Chain) => ({
  chain: chain.id,
  rpc: chain.rpcUrls.default.http[0],
});
function getProfileId(address: Address): Address {
  return keccak256(encodePacked(["uint256", "address"], [0n, address]));
}

export const alloNativeToken: Address =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const allo2API: Partial<API> = {
  createRound: async function (data, signer) {
    try {
      if (!signer?.account) throw new Error("Signer missing");
      const address = getAddress(signer.account?.address);
      const allo = new Allo(createAlloOpts(signer.chain!));

      const client = signer.extend(publicActions);
      // Annoying that a profile must be created to deploy a pool
      const profileId = await getOrCreateProfile(signer);

      const { name, description, strategy, token, managers, initStrategyData } =
        data;

      const pointer = await this.uploadMetadata?.({ name, description });
      const metadata = { protocol: 1n, pointer: pointer || "" };
      const tx = allo.createPool({
        profileId,
        strategy,
        token: token || alloNativeToken,
        managers: [signer.account?.address!, ...(managers ?? [])].map(
          getAddress,
        ),
        // TODO: add data.initialFunding
        amount: 0n,
        metadata,
        initStrategyData,
      });

      const value = BigInt(tx.value);
      const hash = await signer.sendTransaction({
        ...tx,
        value,
        account: address,
        chain: signer.chain,
      });

      // Wait for PoolCreated event and return poolId
      return createLogDecoder(AlloABI, client)(hash, ["PoolCreated"]).then(
        (logs) => {
          const id = String((logs?.[0]?.args as { poolId: bigint }).poolId);
          return { id, chainId: signer.chain?.id };
        },
      );
    } catch (error) {
      console.log(error);
      throw error as Error;
    }
  },
  allocate: () => {},
  distribute: () => {},
};

async function getOrCreateProfile(signer: WalletClient) {
  const registry = new Registry(createAlloOpts(signer.chain!));
  const address = getAddress(signer.account?.address!);
  return registry
    ?.getProfileById(getProfileId(signer.account?.address!))
    .then(async (profile) => {
      if (profile?.anchor === zeroAddress) {
        const { to, data } = registry.createProfile({
          nonce: 0n,
          members: [address],
          owner: address,
          metadata: { protocol: 1n, pointer: "" },
          name: "",
        });
        const hash = await signer.sendTransaction({
          to,
          data,
          account: address,
          chain: signer.chain,
        });
        return createLogDecoder(AlloABI, signer.extend(publicActions))(hash, [
          "ProfileCreated",
        ]).then(
          (logs) => (logs?.[0]?.args as { profileId: Address }).profileId,
        );
      }
      return profile.id;
    });
}

function createLogDecoder(
  abi: readonly unknown[],
  client?: {
    waitForTransactionReceipt: PublicClient["waitForTransactionReceipt"];
  },
) {
  return async (hash: Address, events: string[]) =>
    client?.waitForTransactionReceipt({ hash }).then(({ logs }) => {
      return logs
        .map(({ data, topics }) => {
          try {
            const decoded = decodeEventLog({ abi, data, topics });
            return events.includes(decoded.eventName) ? decoded : null;
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean);
    });
}

export const encoders = {
  directGrants: encodeDirectGrantsLiteData,
};

function encodeDirectGrantsLiteData(data: {
  registrationStartTime: string;
  registrationEndTime: string;
}) {
  return encodeAbiParameters(
    parseAbiParameters([
      "InitializeData data",
      "struct InitializeData { bool useRegistryAnchor; bool metadataRequired; uint64 registrationStartTime; uint64 registrationEndTime; }",
    ]),
    [
      {
        useRegistryAnchor: false,
        metadataRequired: true,
        registrationStartTime: dateToUint64(
          new Date(data.registrationStartTime),
        ),
        registrationEndTime: dateToUint64(new Date(data.registrationEndTime)),
      },
    ],
  );
}

export function dateToUint64(date: Date) {
  return BigInt(Math.round(Number(date) / 1000));
}
