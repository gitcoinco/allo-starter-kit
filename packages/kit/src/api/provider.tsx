"use client";
import { PropsWithChildren, createContext, useContext } from "react";
import { grantsStackAPI } from "./providers/grants-stack";
import { allo2API } from "./providers/allo2";
import { easyRpgfAPI } from "./providers/easy-rpgf";
import { API, RoundsQuery, QueryOpts, RoundInput } from "./types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletClient, getAddress } from "viem";

const Context = createContext({} as API);
const defaultApi: API = {
  rounds: async (query: RoundsQuery) => [],
  roundById: async (id: string, opts?: QueryOpts) => undefined,
  createRound: async (data: RoundInput) =>
    Promise.reject(new Error("Not Implemented: Create Round")),
  projects: async (query: RoundsQuery) => [],
  projectById: async (id: string, opts?: QueryOpts) => undefined,
  applications: async (query: RoundsQuery) => [],
  applicationById: async (id: string, opts?: QueryOpts) => undefined,
  allocate: async () => Promise.reject(new Error("Not Implemented: Allocate")),
  createProject: async () =>
    Promise.reject(new Error("Not Implemented: createProject")),
  createApplication: async () =>
    Promise.reject(new Error("Not Implemented: createApplication")),
  distribute: async () =>
    Promise.reject(new Error("Not Implemented: Distribute")),
  ballot: async () => Promise.reject(new Error("Not Implemented: Ballot")),
  saveBallot: async () =>
    Promise.reject(new Error("Not Implemented: Ballot Save")),
  addToBallot: async () =>
    Promise.reject(new Error("Not Implemented: Ballot Add")),
  upload: async () =>
    Promise.reject(new Error("Not Implemented: Upload Metadata")),
  sendTransaction,
  ...grantsStackAPI,
  ...allo2API,
};

export async function sendTransaction(
  tx: { to: `0x${string}`; data: `0x${string}`; value: string | bigint },
  signer: WalletClient,
) {
  if (!signer?.account) throw new Error("Signer missing");
  const address = getAddress(signer.account?.address);

  return signer.sendTransaction({
    ...tx,
    value: tx.value ? BigInt(tx.value) : undefined,
    account: address,
    chain: signer.chain,
  });
}

export const providers = {
  grantsStackAPI,
  easyRpgfAPI,
  allo2API,
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function ApiProvider({
  children,
  provider = grantsStackAPI,
}: PropsWithChildren<{ provider?: Partial<API> }>) {
  const queryClient = getQueryClient();
  const value = { ...defaultApi, ...provider };
  return (
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={value}>{children}</Context.Provider>
    </QueryClientProvider>
  );
}

export function useAPI() {
  return useContext(Context);
}
