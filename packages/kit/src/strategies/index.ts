/*
TODO:

If we move this to the ApiProvider developers can add their own strategy extensions.


*/

import { FunctionComponent, useMemo } from "react";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import { supportedChains, useWalletClient } from "../wagmi";
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
import { Round } from "../api/types";
import { useAPI } from "..";
import { Address } from "viem";

export type StrategyAddonType =
  | "createRound"
  | "registerRecipient"
  | "reviewRecipients"
  | "allocate";

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
    allocate: {
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
function getStrategyTypeFromName(strategyName: string, chainId: number) {
  return reduceSupportedChains(
    chainId,
    ([name]) => name === strategyMap[strategyName as keyof typeof strategyMap],
  );
}

export function getStrategyTypeFromAddress(
  strategyAddress: Address,
  chainId: number,
) {
  return reduceSupportedChains(
    chainId,
    ([_, address]) => address === strategyAddress,
  );
}

export function useStrategyType(round?: Round) {
  return useMemo(
    () =>
      round && getStrategyTypeFromName(round?.strategyName!, round?.chainId),
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
