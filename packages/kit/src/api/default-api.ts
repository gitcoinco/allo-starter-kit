"use client";
import { WalletClient, getAddress } from "viem";

import { grantsStackAPI } from "./providers/grants-stack";
import { allo2API } from "./providers/allo2";
import { directGrants } from "../strategies/direct-grants";
import { quadraticFunding } from "../strategies/quadratic-funding";

import { API, TransactionInput } from "./types";
import { StrategyExtensions } from "../strategies";

/*
These are all the available methods in the API. Throws an error if not implemented.
*/
const emptyAPI: API = {
  rounds: async () => Promise.reject(new Error("Not Implemented: rounds")),
  roundById: async () =>
    Promise.reject(new Error("Not Implemented: roundById")),
  createRound: async () =>
    Promise.reject(new Error("Not Implemented: createRound")),
  projects: async () => Promise.reject(new Error("Not Implemented: projects")),
  projectById: async () =>
    Promise.reject(new Error("Not Implemented: projectById")),
  applications: async () =>
    Promise.reject(new Error("Not Implemented: applications")),
  applicationById: async () =>
    Promise.reject(new Error("Not Implemented: applicationById")),
  allocate: async () => Promise.reject(new Error("Not Implemented: allocate")),
  createProject: async () =>
    Promise.reject(new Error("Not Implemented: createProject")),
  createApplication: async () =>
    Promise.reject(new Error("Not Implemented: createApplication")),
  distribute: async () =>
    Promise.reject(new Error("Not Implemented: Distribute")),

  // AlloKit doesn't have a server so this needs to be implemented by the client.
  // Alternatively we can provide an endpoint (See apps/demo/src/app/api/ipfs/route.ts)
  upload: async () => Promise.reject(new Error("Not Implemented: upload")),

  // Defines how the transaction data is sent. More details below.
  sendTransaction: async () =>
    Promise.reject(new Error("Not Implemented: sendTransaction")),

  // The Ballot API handles could start by implementing a localStorage API
  // Works for Checkout Cart also - can we find a better name than ballot?
  ballot: async () => Promise.reject(new Error("Not Implemented: Ballot")),
  saveBallot: async () =>
    Promise.reject(new Error("Not Implemented: saveBallot")),
  addToBallot: async () =>
    Promise.reject(new Error("Not Implemented: addToBallot")),
};

export const providers = {
  grantsStackAPI,
  allo2API,
};

export const strategies = {
  directGrants,
  quadraticFunding,
};

/* 
A custom sendTransaction can be sent to ApiProvider. 
<ApiProvider api={{ sendTransaction: cometh.wallet.sendTransaction }} />

The default sendTransaction uses the Viem wallet signer of the connected wallet
*/
export async function sendTransaction(
  tx: TransactionInput,
  signer?: WalletClient,
) {
  if (!signer?.account) throw new Error("Signer missing");
  const address = getAddress(signer.account?.address);

  return signer.sendTransaction({
    ...tx,
    value: BigInt(tx.value),
    account: address,
    chain: signer.chain,
  });
}

export function mergeApi({
  api,
  strategies,
}: Partial<{ api: Partial<API>; strategies: StrategyExtensions }>): {
  api: API;
  strategies: StrategyExtensions;
} {
  return {
    api: {
      ...emptyAPI,
      ...grantsStackAPI,
      ...allo2API,
      sendTransaction,
      ...api,
    },
    strategies: {
      directGrants,
      quadraticFunding,
      ...strategies,
    },
  };
}
