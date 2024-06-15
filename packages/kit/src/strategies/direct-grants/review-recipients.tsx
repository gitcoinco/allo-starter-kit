import { Address, WalletClient } from "viem";

import { DirectGrantsLiteStrategy } from "@allo-team/allo-v2-sdk/";
import { API, Application } from "../../api/types";

export const call = (
  applications: Application[],
  selected: string[],
  strategy: Address,
  statusValue: bigint,
  api: Pick<API, "sendTransaction">,
  signer: WalletClient,
) => {
  const statuses: { index: bigint; statusRow: bigint }[] = applications.map(
    (application, index) => ({
      index: BigInt(index),
      statusRow: selected.includes(application.id) ? statusValue : BigInt(0),
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
