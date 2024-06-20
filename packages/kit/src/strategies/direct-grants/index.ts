import z from "zod";
import {
  schema as directGrantsRoundSchema,
  CreateRoundForm as DirectGrantsCreateRoundForm,
} from "./create-round";
import {
  schema as directGrantsRegisterSchema,
  RegisterRecipientForm as DirectGrantsRegisterRecipientForm,
} from "./register-recipient";
import { call as reviewRecipientsCall } from "./review-recipients";
import { call as allocateCall } from "./allocate";
import { StrategyExtension } from "..";
import { supportedChains } from "../..";

export const directGrants: StrategyExtension = {
  name: "Direct Grants Lite",
  type: "directGrants",
  // Deployed strategy contract address for all supported networks
  contracts: supportedChains.reduce(
    (acc, x) => ({ ...acc, [x.id]: x.contracts.directGrants }),
    {},
  ),
  components: {
    createRound: {
      schema: directGrantsRoundSchema,
      component: DirectGrantsCreateRoundForm,
    },
    registerRecipient: {
      schema: directGrantsRegisterSchema,
      component: DirectGrantsRegisterRecipientForm,
    },
    reviewRecipients: {
      call: reviewRecipientsCall,
    },
    allocate: {
      call: allocateCall,
    },
  },
};
