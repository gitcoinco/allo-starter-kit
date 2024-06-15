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
import { call as reviewRecipientsCall } from "../strategies/direct-grants/review-recipients";
import { supportedChains, useWalletClient } from "../wagmi";
import { Round } from "../api/types";
import z from "zod";
import { useAPI } from "..";
import { useMutation } from "@tanstack/react-query";

export type StrategyAddonType =
  | "createRound"
  | "registerRecipient"
  | "reviewRecipients";
export type StrategyType = "directGrants";
export type StrategyAddon = {
  schema: any;
  defaultValues: unknown;
  component: FunctionComponent | null;
  call?: Function;
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
      call: reviewRecipientsCall,
    },
  },
};

const strategyMap = {
  "allov2.DirectGrantsLiteStrategy": "directGrants",
} as const;

export function getStrategyAddon(
  strategy: StrategyType,
  component: keyof (typeof strategyAddons)[typeof strategy],
) {
  return strategyAddons[strategy]?.[component] as StrategyAddon | undefined;
}

export function getStrategyType(strategyName: string, chainId: number) {
  return supportedChains?.reduce((match, chain) => {
    // Find the key matching the strategy address
    const type = Object.entries(chain.contracts ?? {}).find(([key]) => {
      return (
        chainId === chain.id &&
        key === strategyMap[strategyName as keyof typeof strategyMap]
      );
    });

    return type?.[0] || match;
  }, "");
}

export function useStrategyType(round?: Round) {
  return useMemo(
    () => round && getStrategyType(round?.strategyName!, round?.chainId),
    [round],
  );
}

export function useStrategyAddon(component: StrategyAddonType, round?: Round) {
  const api = useAPI();
  const { data: signer } = useWalletClient();
  const type = useStrategyType(round);
  const addon = getStrategyAddon(type as StrategyType, component);
  return {
    ...addon,
    // Wrap the strategy call function in useMutation (for loading + error states)
    // Include api + signer
    call: useMutation({
      mutationFn: (args: unknown[]) => addon?.call?.(...args, api, signer),
    }),
  };
}
