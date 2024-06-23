"use client";

import { ApiProvider, Web3Provider } from "@allo/kit";

export function AlloKitProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApiProvider>
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
}
