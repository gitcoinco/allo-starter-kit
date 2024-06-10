"use client";
import { PropsWithChildren, createContext, useContext } from "react";
import { grantsStackAPI } from "./providers/grants-stack";
import { allo2API } from "./providers/allo2";
import { easyRpgfAPI } from "./providers/easy-rpgf";
import { API, RoundsQuery, QueryOpts, RoundInput } from "./types";

const Context = createContext({} as API);
const defaultApi: API = {
  rounds: async (query: RoundsQuery) => [],
  roundById: async (id: string, opts?: QueryOpts) => undefined,
  createRound: async (data: RoundInput) =>
    new Error("Not Implemented: Create Round"),
  projects: async (query: RoundsQuery) => [],
  projectById: async (id: string, opts?: QueryOpts) => undefined,
  applications: async (query: RoundsQuery) => [],
  applicationById: async (id: string, opts?: QueryOpts) => undefined,
  allocate: async () => new Error("Not Implemented: Allocate"),
  distribute: async () => new Error("Not Implemented: Distribute"),
  ballot: async () => new Error("Not Implemented: Ballot"),
  saveBallot: async () => new Error("Not Implemented: Ballot Save"),
  addToBallot: async () => new Error("Not Implemented: Ballot Add"),
  upload: async () => new Error("Not Implemented: Upload Metadata"),
  ...grantsStackAPI,
  ...allo2API,
};

export const providers = {
  grantsStackAPI,
  easyRpgfAPI,
  allo2API,
};

export function ApiProvider({
  children,
  api,
  provider = grantsStackAPI,
}: PropsWithChildren<{ provider: Partial<API>; api: Partial<API> }>) {
  const value = { ...defaultApi, ...provider, ...api };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAPI() {
  return useContext(Context);
}
