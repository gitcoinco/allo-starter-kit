import { Address, WalletClient } from "viem";

import { DirectGrantsLiteStrategy } from "@allo-team/allo-v2-sdk/";
import { API } from "../../api/types";

export const call = (
  applicationIds: string[],
  selected: string[],
  strategy: Address,
  statusValue: bigint,
  api: Pick<API, "sendTransaction">,
  signer: WalletClient,
) => {
  const statuses: { index: bigint; statusRow: bigint }[] = applicationIds.map(
    (applicationId) => ({
      index: BigInt(applicationId),
      statusRow: selected.includes(applicationId) ? statusValue : BigInt(0),
    }),
  );
  const refRecipientsCounter = BigInt(statuses.length);

  const tx = DirectGrantsLiteStrategy.prototype.reviewRecipients.call(
    { strategy },
    statuses,
    refRecipientsCounter,
  );

  return api.sendTransaction(tx, signer);
};
