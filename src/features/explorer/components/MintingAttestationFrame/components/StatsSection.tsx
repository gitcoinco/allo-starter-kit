import { StatItem } from "./StatItem";

export type StatsSectionProps = {
  projectsFunded: number;
  roundsSupported: number;
  checkedOutChains: number;
};

export const StatsSection = ({
  projectsFunded,
  roundsSupported,
  checkedOutChains,
}: StatsSectionProps) => {
  return (
    <div className="flex w-full flex-col">
      <StatItem label="Projects Funded" amount={projectsFunded} className="h-[204px]" />
      <StatItem label="Rounds Supported" amount={roundsSupported} className="h-[203px]" />
      <StatItem label="Chains" amount={checkedOutChains} className="h-[205px] rounded-br-lg" />
    </div>
  );
};
