"use client";
import { PropsWithChildren, createContext, useContext } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { API } from "./types";

import { Toaster } from "../ui/toaster";
import { StrategyExtensions } from "../strategies";
import { getQueryClient } from "./query-client";
import { mergeApi } from "./default-api";

if (typeof window !== "undefined") {
  posthog.init("phc_MkecAopGBhofBbwLqvcvV0iyHBZWSlemr7krp6lxLjl", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always",
  });
}

type ProviderAPI = { api: API; strategies: StrategyExtensions };
const Context = createContext({} as ProviderAPI);

export function ApiProvider({
  children,
  api,
  strategies,
  ...props
}: PropsWithChildren<{
  api?: Partial<API>;
  strategies?: StrategyExtensions;
}>) {
  const queryClient = getQueryClient();
  const value = mergeApi({ api, strategies });

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={value}>
          {children}
          <Toaster />
        </Context.Provider>
      </QueryClientProvider>
    </PostHogProvider>
  );
}

export function useAPI() {
  return useContext(Context).api;
}

export function useStrategies() {
  return useContext(Context).strategies;
}
