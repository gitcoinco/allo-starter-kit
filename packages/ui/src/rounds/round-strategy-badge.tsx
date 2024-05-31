import { RoundPayoutType, RoundStrategyType } from "@/api/types";
import { Badge } from "../ui/badge";

type Props = { strategyName: RoundPayoutType };

function getRoundStrategyType(name: string): RoundStrategyType {
  switch (name) {
    case "allov1.Direct":
    case "DIRECT":
    case "allov2.DirectGrantsSimpleStrategy":
      return "DirectGrants";

    case "allov1.QF":
    case "MERKLE":
    case "allov2.DonationVotingMerkleDistributionDirectTransferStrategy":
      return "QuadraticFunding";

    default:
      throw new Error(`Unknown round strategy type: ${name}`);
  }
}

export function getRoundStrategyTitle(name: string) {
  switch (getRoundStrategyType(name)) {
    case "DirectGrants":
      return "Direct Grants";

    case "QuadraticFunding":
      return "Quadratic Funding";
  }
}

export function RoundStrategyBadge({ strategyName }: Props) {
  return <Badge variant="blue">{getRoundStrategyTitle(strategyName)}</Badge>;
}
