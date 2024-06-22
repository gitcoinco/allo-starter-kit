import { NATIVE } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import { Address, erc20Abi, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { useToast } from "../ui/use-toast";

export const nativeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const isNativeToken = (token?: Address) =>
  [zeroAddress, NATIVE].includes(token?.toLowerCase()!);

export function useToken(opts: { token?: Address }) {
  const { address } = useAccount();
  const token = isNativeToken(opts.token) ? undefined : opts.token;

  console.log("token", opts, token);
  const tokenContract = {
    address: token,
    abi: erc20Abi,
  };
  //   const { data: balance } = useBalance({
  //     address,
  //     token: tokenContract.address,
  //   });

  //   const network = supportedChains?.find((n) => n.chain === round?.network);
  const query = useReadContracts({
    allowFailure: false,
    contracts: [
      { ...tokenContract, functionName: "decimals" },
      { ...tokenContract, functionName: "symbol" },
      //   {
      //     ...tokenContract,
      //     functionName: "allowance",
      //     args: [address!, allo.alloAddress],
      //   },
    ],
  });
  console.log(query.data, query.error, opts);
  const [decimals, symbol] = query.data ?? [];
  return {
    ...query,
    data: {
      decimals,
      symbol,
    },
  };
  //   const [decimals = network?.nativeCurrency.decimals ?? 18, symbol, allowance] =
  //     (token.data ?? []) as [number, string, bigint];
  //   return {
  //     ...token,
  //     data: {
  //       address: tokenAddress,
  //       isNativeToken,
  //       symbol: isNativeToken ? network?.nativeCurrency.name : symbol ?? "",
  //       balance: balance?.value ?? 0n,
  //       decimals,
  //       allowance,
  //     },
  //   };
}
