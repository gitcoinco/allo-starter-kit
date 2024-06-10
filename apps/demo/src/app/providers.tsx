"use client";

import {
  ApiProvider,
  Web3Provider,
  grantsStackAPI,
} from "../../../../packages/kit/src";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Web3Provider>
      <ApiProvider
        provider={grantsStackAPI}
        api={{
          upload: async (data) =>
            fetch(`/api/ipfs`, { method: "POST", body: data })
              .then((r) => r.json())
              .then((r) => r.cid),
        }}
      >
        {children}
      </ApiProvider>
    </Web3Provider>
  );
}
