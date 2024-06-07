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
          uploadMetadata: async (data: unknown) =>
            fetch(`/api/ipfs`, {
              method: "POST",
              body: JSON.stringify(data),
              headers: { "content-type": "application/json" },
            })
              .then((r) => r.json())
              .then((r) => r.url),
        }}
      >
        {children}
      </ApiProvider>
    </Web3Provider>
  );
}
