import clsx from "clsx";

export type HeaderSectionProps = {
  logo: string;
  ensName?: string;
  address?: string;
};

export const HeaderSection = ({ logo, ensName = "", address = "" }: HeaderSectionProps) => {
  const addressText = ensName ? ensName : address;
  return (
    <div className="flex h-auto w-full items-center justify-between rounded-t-lg border-b border-black px-8 py-5">
      <div
        className={clsx(
          "max-w-[80%] truncate font-mono font-medium text-black",
          !!ensName ? "text-[32px]/[41.66px]" : "text-lg/[23.44px]",
        )}
      >
        {addressText}
      </div>
      <img className="h-10 w-auto" alt="Logo" src={logo} />
    </div>
  );
};
