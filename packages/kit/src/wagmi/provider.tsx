"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { PropsWithChildren } from "react";
import { Config, WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { Chain } from "viem/chains";
import * as wagmiChains from "viem/chains";

import { getChains } from "@gitcoin/gitcoin-chain-data";

export const supportedChains = getChains();

console.log(supportedChains);

export const chains = Object.values(wagmiChains).filter((chain) =>
  supportedChains.map((c) => c.id).includes(chain.id),
) as unknown as [Chain, ...Chain[]];

const defaultConfig = getDefaultConfig({
  appName: "Allo Starter Kit",
  projectId: "ffa6468a2accec2f1e59502fae10c166",
  chains,
  ssr: true,
});

export function Web3Provider({
  children,
  config = defaultConfig,
}: PropsWithChildren<{ config?: Config }>) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
