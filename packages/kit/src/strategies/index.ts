import {
  schema as directGrantsRoundSchema,
  defaultValues as directGrantsRoundDefaultValues,
  CreateRoundForm as DirectGrantsCreateRoundForm,
} from "@/strategies/direct-grants/create-round";
import {
  schema as directGrantsRegisterSchema,
  defaultValues as directGrantsRecipientDefaultValues,
  RegisterRecipientForm as DirectGrantsRegisterRecipientForm,
} from "@/strategies/direct-grants/register-recipient";

export const strategyAddons = {
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
  },
};

export function getStrategyAddon(
  strategy: keyof typeof strategyAddons,
  component: keyof (typeof strategyAddons)[typeof strategy],
) {
  return strategyAddons[strategy][component];
}
