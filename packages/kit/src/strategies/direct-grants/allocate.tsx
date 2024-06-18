import { getAddress as alloAddress } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import { DirectGrantsLiteStrategy } from "@allo-team/allo-v2-sdk";
import { Address, Chain, WalletClient, getAddress } from "viem";
import { API, Application, Round, TransactionInput } from "../../api/types";

type Allocation = {
  token: `0x${string}`;
  recipientId: `0x${string}`;
  amount: bigint;
};

export const call = (
  round: Round,
  state: Record<string, number>,
  applications: Application[],
  api: Pick<API, "sendTransaction">,
  signer: WalletClient,
) => {
  const allocations: Allocation[] = buildAllocations(
    round.matching.token,
    state,
    applications,
  );

  const tx = DirectGrantsLiteStrategy.prototype.getAllocateData.call(
    {
      poolId: BigInt(round.id),
      checkPoolId: Function,
      allo: { address: () => alloAddress({ id: round.chainId } as Chain) },
    },
    allocations,
  );

  return api.sendTransaction(tx, signer);
};

function buildAllocations(
  token: Address,
  state: Record<string, number>,
  applications: Application[],
) {
  return Object.entries(state)
    .filter(([_, amount]) => amount > 0)
    .map(([projectId, amount]) => {
      const application = applications.find(
        (appl) => appl.projectId === projectId,
      );
      return {
        token,
        recipientId: getAddress(application?.recipient!),
        amount: BigInt(amount),
      };
    });
}
