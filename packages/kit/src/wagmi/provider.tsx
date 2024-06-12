"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, WagmiProvider, createConfig, http } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { Chain } from "viem/chains";
import * as wagmiChains from "viem/chains";

import { getChains } from "@grants-labs/gitcoin-chain-data";

export const supportedChains = getChains().map((chain) => ({
  ...chain,
  // Temp: npm doesn't include the contracts data so this is just to test
  // contracts:
  //   chain.id === 11155111
  //     ? {
  //         multiRoundCheckout: "0xa54A0c7Bcd37745f7F5817e06b07E2563a07E309",
  //         quadraticFunding: "0x787eC93Dd71a90563979417879F5a3298389227f",
  //         directGrants: "0xDC5c7873899118A927B2Df256bf8068cd056aeD2",
  //         // directGrants: "0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa",
  //       }
  //     : undefined,
}));

console.log(supportedChains);
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

export const chains: Chain[] = Object.values(wagmiChains).filter((chain) =>
  supportedChains.map((c) => c.id).includes(chain.id),
);
const defaultConfig = getDefaultConfig({
  appName: "Allo Starter Kit",
  projectId: "ffa6468a2accec2f1e59502fae10c166",
  chains,
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// const defaultConfig = createConfig({
//   // Why is typings not working correctly here?
//   chains,
//   connectors: [injected()],
//   transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
// });
export function Web3Provider({
  children,
  config = defaultConfig,
}: PropsWithChildren<{ config?: Config }>) {
  const queryClient = getQueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
