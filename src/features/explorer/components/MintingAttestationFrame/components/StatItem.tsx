import clsx from "clsx";

export type StatItemProps = {
  label: string;
  amount: number;
  className?: string;
};

export const StatItem = ({ label, amount, className }: StatItemProps) => {
  return (
    <div
      className={clsx(
        "flex w-full flex-col items-start justify-between border-black p-8",
        className,
      )}
    >
      <div className="font-mono text-[64px]/[64px] font-medium text-black ">{amount}</div>
      <div className="font-mono text-[20px]/[26.04px] font-medium text-black">{label}</div>
    </div>
  );
};
