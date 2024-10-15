export type TopRoundSectionProps = {
  roundName: string;
};

export const TopRoundSection = ({ roundName }: TopRoundSectionProps) => {
  return (
    <div className="inline-flex h-[205px] w-full flex-col items-start justify-between rounded-bl-lg border-r border-black p-8">
      <div className="font-mono text-[20px]/[26.04px] font-medium text-black ">Top Round</div>
      <div className="whitespace-normal font-modern-era text-[32px]/[32px] font-medium text-black">
        {roundName}
      </div>
    </div>
  );
};
