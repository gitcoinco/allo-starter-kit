"use client";

import { ApiProvider, Web3Provider, strategies } from "@allo/kit";

export function AlloKitProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApiProvider
      strategies={strategies}
      api={{
        upload: async (data) =>
          fetch(`/api/ipfs`, { method: "POST", body: data })
            .then((r) => r.json())
            .then((r) => r.cid),
      }}
    >
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
}
