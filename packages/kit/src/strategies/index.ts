import { Address } from "viem";
import { FunctionComponent, useMemo } from "react";
import {
  schema as directGrantsRoundSchema,
  defaultValues as directGrantsRoundDefaultValues,
  CreateRoundForm as DirectGrantsCreateRoundForm,
} from "../strategies/direct-grants/create-round";
import {
  schema as directGrantsRegisterSchema,
  defaultValues as directGrantsRecipientDefaultValues,
  RegisterRecipientForm as DirectGrantsRegisterRecipientForm,
} from "../strategies/direct-grants/register-recipient";
import { supportedChains } from "../wagmi";
import { Round } from "../api/types";
import z from "zod";

export type StrategyAddonType =
  | "createRound"
  | "registerRecipient"
  | "reviewRecipients";
export type StrategyType = "directGrants";
export type StrategyAddon = {
  schema: any;
  defaultValues: unknown;
  component: FunctionComponent | null;
};
export const strategyAddons: Record<
  StrategyType,
  Record<StrategyAddonType, StrategyAddon>
> = {
  directGrants: {
    createRound: {
      schema: directGrantsRoundSchema,
      defaultValues: directGrantsRoundDefaultValues,
      component: DirectGrantsCreateRoundForm,
    },
    registerRecipient: {
      schema: directGrantsRegisterSchema,
      defaultValues: directGrantsRecipientDefaultValues,
      component: DirectGrantsRegisterRecipientForm,
    },
    reviewRecipients: {
      schema: z.any(),
      defaultValues: null,
      component: null,
    },
  },
};

export function getStrategyAddon(
  strategy: StrategyType,
  component: keyof (typeof strategyAddons)[typeof strategy],
) {
  return strategyAddons[strategy]?.[component] as StrategyAddon | undefined;
}

export function getStrategyType(strategy: Address, chainId: number) {
  return supportedChains?.reduce((match, chain) => {
    // Find the key matching the strategy address
    const type = Object.entries(chain.contracts ?? {}).find(
      ([key, address]) => address === strategy,
    );
    return type?.[0] || match;
  }, "");
}

export function useStrategyType(round?: Round) {
  return useMemo(
    () => round && getStrategyType(round?.strategy, round?.chainId),
    [round],
  );
}

export function useStrategyAddon(component: StrategyAddonType, round?: Round) {
  return useMemo<StrategyAddon | undefined>(() => {
    const type = round && getStrategyType(round?.strategy, round?.chainId);
    if (!type) return undefined;
    return getStrategyAddon(type as StrategyType, component);
  }, [round]);
}
