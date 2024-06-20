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
  TransactionBase,
  TransactionRequestBase,
} from "viem";
import { API } from "../../types";
import { Allo, Registry, TransactionData } from "@allo-team/allo-v2-sdk/";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";

import { decodeEventLog, type Address, type Chain } from "viem";

const createAlloOpts = (chain: Chain) => ({
  chain: chain.id,
  rpc: chain.rpcUrls.default.http[0],
});
function getProfileId(address: Address): Address {
  return keccak256(encodePacked(["uint256", "address"], [BigInt(0), address]));
}

export const alloNativeToken: Address =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const allo2API: Partial<API> = {
  createRound: async function (data, signer) {
    try {
      if (!signer?.account) throw new Error("Signer missing");

      const allo = new Allo(createAlloOpts(signer.chain!));

      const client = signer.extend(publicActions);
      // Annoying that a profile must be created to deploy a pool
      const profileId = await getOrCreateProfile(signer);

      const {
        amount = BigInt(0),
        metadata,
        strategy,
        token,
        managers = [],
        initStrategyData = "0x",
      } = data;
      if (typeof initStrategyData !== "string")
        throw new Error("initStrategyData must be a bytes string.");

      const tx = allo.createPool({
        profileId,
        strategy,
        // Set token address to native token if empty or zero address
        token: !token || token === zeroAddress ? alloNativeToken : token,
        managers,
        amount,
        metadata,
        initStrategyData,
      });

      const hash = await this.sendTransaction?.(tx, signer);

      // Wait for PoolCreated event and return poolId
      return createLogDecoder(AlloABI, client)(hash!, ["PoolCreated"]).then(
        (logs) => {
          const id = String((logs?.[0]?.args as { poolId: bigint }).poolId);
          return { id, chainId: signer.chain?.id as number };
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createApplication: async function (data, signer) {
    try {
      if (!signer?.account) throw new Error("Signer missing");
      const allo = new Allo(createAlloOpts(signer.chain!));

      const client = signer.extend(publicActions);

      const { roundId, strategyData = "0x" } = data;

      const tx = allo.registerRecipient(roundId, strategyData);

      const hash = await this.sendTransaction?.(tx, signer);

      // Wait for PoolCreated event and return poolId
      return createLogDecoder(AlloABI, client)(hash!, [
        "UpdatedRegistration",
      ]).then((logs) => {
        const id = String(
          (logs?.[0]?.args as { recipientId: Address }).recipientId,
        );
        return { id, chainId: signer.chain?.id as number };
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  createProject: async function (data, signer) {
    try {
      if (!signer?.account) throw new Error("Signer missing");
      const address = getAddress(signer.account?.address);
      const allo = new Allo(createAlloOpts(signer.chain!));

      const client = signer.extend(publicActions);

      const { name, description } = data;

      const chainId = signer.chain?.id as number;
      throw new Error("Create Project not implemented yet");
      return { id: "id", chainId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  allocate: async function (tx, signer) {
    try {
      return await this.sendTransaction?.(tx, signer);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
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
          nonce: BigInt(0),
          members: [address],
          owner: address,
          metadata: { protocol: BigInt(1), pointer: "" },
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
          (logs) => (logs?.[0]?.args as { profileId: Address })?.profileId,
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
