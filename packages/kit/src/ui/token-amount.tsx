"use client";
import { erc20Abi, formatUnits, getAddress } from "viem";
import { useReadContracts } from "wagmi";
import { formatNumber } from "../lib/utils";

export function TokenAmount({
  amount = BigInt(0),
  token,
  symbol = true,
}: {
  amount: bigint;
  token: string;
  symbol?: boolean;
}) {
  const { data } = useToken(token);

  return (
    <>
      {formatNumber(Number(formatUnits(amount, data?.decimals)))}{" "}
      {symbol && data?.symbol}
    </>
  );
}

// TODO: use a http api instead of wagmi so user doesn't need to be connected with wallet?
export function useToken(tokenAddress: string) {
  const address = tokenAddress ? getAddress(tokenAddress) : undefined;
  const tokenContract = { address, abi: erc20Abi };

  const token = useReadContracts({
    allowFailure: false,
    contracts: [
      { ...tokenContract, functionName: "decimals" },
      { ...tokenContract, functionName: "symbol" },
    ],
  });

  const [decimals = 18, symbol = "ETH"] = token.data ?? [];
  return {
    ...token,
    data: { address, symbol, decimals },
  };
}
