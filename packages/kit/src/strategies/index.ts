import { FunctionComponent, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { supportedChains, useWalletClient } from "../wagmi";
import { Round } from "../api/types";
import { useAPI, useStrategies } from "..";
import { Address } from "viem";
import { TContracts } from "@gitcoin/gitcoin-chain-data";

export type StrategyComponentType =
  | "createRound"
  | "registerRecipient"
  | "reviewRecipients"
  | "allocate";

export type StrategyType = keyof TContracts | string
export type StrategyExtension = {
  name: string;
  type: StrategyType ;
  contracts: Record<number, Address>;
  components: Partial<
    Record<
      StrategyComponentType,
      Partial<{
        schema: any;
        defaultValues: unknown;
        component: FunctionComponent | null;
        call?: Function;
      }>
    >
  >;
};
export type StrategyExtensions = Record<
  StrategyType ,
  StrategyExtension
>;

const strategyMap = {
  "allov2.DirectGrantsLiteStrategy": "directGrants",
} as const;

function getStrategyTypeFromName(strategyName: string, chainId: number) {
  return reduceSupportedChains(
    chainId,
    ([name]) => name === strategyMap[strategyName as keyof typeof strategyMap],
  );
}

// Helper function to find matching contract from name or address
function reduceSupportedChains(
  chainId: number,
  compare: (args: [key: string, address: Address]) => boolean,
) {
  return supportedChains?.reduce((match, chain) => {
    const type = Object.entries(chain.contracts ?? {}).find(
      ([key, address]) => chain.id === chainId && compare([key, address]),
    );

    return type?.[0] || match;
  }, "");
}

export function useStrategyType(round?: Round) {
  return useMemo(
    () =>
      round && getStrategyTypeFromName(round?.strategyName!, round?.chainId),
    [round],
  );
}

export function useStrategyAddon(
  component: StrategyComponentType,
  round?: Round,
) {
  const api = useAPI();
  const strategies = useStrategies();
  const { data: signer } = useWalletClient();

  const type = useStrategyType(round);
  const addon = type && (strategies as any)?.[type]?.components?.[component];
  return {
    ...addon,
    // Wrap the strategy call function in useMutation (for loading + error states)
    // Include api + signer
    call: useMutation({
      mutationFn: (args: unknown[]) => addon?.call?.(...args, api, signer),
    }),
  };
}
