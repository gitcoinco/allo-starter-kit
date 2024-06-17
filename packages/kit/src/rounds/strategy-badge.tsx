import { Badge, BadgeProps } from "../ui/badge";

export function RoundStrategyBadge({
  strategyName,
}: {
  strategyName?: string;
}) {
  const [_, strategy, color] =
    Object.entries(strategyMap)
      .map(([key, label], index) => [key, label, colors[index]])
      .find(([key]) => key === strategyName) ?? [];

  if (!strategy) return null;
  return (
    <Badge
      title={strategyName}
      variant={color as BadgeProps["variant"]}
      className={"whitespace-nowrap"}
    >
      {strategy}
    </Badge>
  );
}

// Name of strategies
const strategyMap = {
  "allov1.QF": "Quadratic funding",
  "allov2.DonationVotingMerkleDistributionDirectTransferStrategy":
    "Direct grant",
  "allov2.QVSimpleStrategy": "Quadratic voting",
  "allov2.DirectGrantsSimpleStrategy": "Direct grant",
  "allov2.DirectGrantsLiteStrategy": "Direct grant (lite)",
  "allov2.RFPCommitteeStrategy": "RFP",
};

// Color of the badge (maps to order of strategyMap)
const colors = [
  "blue",
  "yellow",
  "secondary",
  "secondary",
  "secondary",
] as const;
