"use client";
import { PropsWithChildren, createContext, useContext } from "react";
import { grantsStackAPI } from "./providers/grants-stack";
import { easyRpgfAPI } from "./providers/easy-rpgf";
import { API, RoundsQuery, QueryOpts } from "./types";

const Context = createContext({} as API);

const defaultApi: API = {
  rounds: async (query: RoundsQuery) => [],
  roundById: async (id: string, opts?: QueryOpts) => undefined,
  projects: async (query: RoundsQuery) => [],
  projectById: async (id: string, opts?: QueryOpts) => undefined,
  applications: async (query: RoundsQuery) => [],
  applicationById: async (id: string, opts?: QueryOpts) => undefined,
  allocate: async () => notImpleneted("allocate"),
  distribute: async () => notImpleneted("distribute"),
  ballot: async () => notImpleneted("ballot"),
  saveBallot: async () => notImpleneted("saveBallot"),
  addToBallot: async () => notImpleneted("saveBallot"),
};

const notImpleneted = async (feature: string) => {
  console.log(`not implemented: ${feature}`);
  return {};
};

export const providers = {
  grantsStackAPI,
  easyRpgfAPI,
};

export function ApiProvider({
  children,
  provider = grantsStackAPI,
}: PropsWithChildren<{ provider: Partial<API> }>) {
  const api = { ...defaultApi, ...provider };
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useAPI() {
  return useContext(Context);
}
