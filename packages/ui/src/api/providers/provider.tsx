"use client";
import { PropsWithChildren, createContext, useContext } from "react";
import { grantsStackAPI } from "./grants-stack";
import { easyRpgfAPI } from "./easy-rpgf";
import { API, RoundsQuery, QueryOpts } from "./types";

const Context = createContext({} as API);

export const providers = {
  "grants-stack": grantsStackAPI,
  "easy-rpgf": easyRpgfAPI,
};

const defaultApi: API = {
  rounds: (query: RoundsQuery) => [],
  roundById: (id: string, opts?: QueryOpts) => undefined,
  projects: (query: RoundsQuery) => [],
  projectById: (id: string, opts?: QueryOpts) => undefined,
  applications: (query: RoundsQuery) => [],
  allocate: () => notImpleneted("allocate"),
  distribute: () => notImpleneted("distribute"),
  ballot: () => (notImpleneted("ballot"), {}),
  saveBallot: () => (notImpleneted("saveBallot"), {}),
  addToBallot: () => (notImpleneted("saveBallot"), {}),
};

const notImpleneted = (feature: string) =>
  console.log(`not implemented: ${feature}`);

export function ApiProvider({
  children,
  provider = "grants-stack",
}: PropsWithChildren<{ provider: "grants-stack" }>) {
  const api = { ...defaultApi, ...providers[provider] };
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useAPI() {
  return useContext(Context);
}
