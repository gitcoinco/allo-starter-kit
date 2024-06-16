# Allo Starter Kit

### Getting Started

```sh
bun add @allo/kit # or npm i -S @allo/kit
```

1. #### Add Component Styles

```tsx
import "@allo/kit/styles.css";
```

2. #### Add AlloKit Providers

```tsx
"use client";
import { ApiProvider, Web3Provider } from "@allo/kit";

export function AlloKitProviders({ children }: PropsWithChildren) {
  // Provide Upload metadata API (See ApiProvider for full interface)
  async function upload(data) {
    return fetch(`/api/ipfs`, { method: "POST", body: data })
      .then((r) => r.json())
      .then((r) => r.cid);
  }

  return (
    <ApiProvider provider={{ upload }}>
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
}
```

3. #### Import & Use Components

```tsx
import {
  Button,
  CreateRound,
  DiscoverRounds,
  RoundDetails,
  DiscoverProjects,
  ProjectDetails,
  CreateApplication,
  FundRound,
  Allocate,
  Distribute,
} from "@allo/kit";
```

See Storybook for more components:  
https://allo-starter-kit-storybook.vercel.app

### Usage

See `apps/demo`

#### Demo App

The Demo App shows most of the basic usage.

Link: https://allo-starter-kit-demo.vercel.app

Explore code:

- [AlloKit Providers](./apps/demo/src/app/providers.tsx)
- [Discover Rounds page](./apps/demo/src/app/%5BchainId%5D/page.tsx)
- [Round Details page + Discover Applications](./apps/demo/src/app/%5BchainId%5D/rounds/%5BroundId%5D/page.tsx)
- [Project Details page](./apps/demo/src/app/%5BchainId%5D/projects/%5BprojectId%5D/page.tsx)
- [Create Application / Apply to Round](./apps/demo/src/app/%5BchainId%5D/rounds/%5BroundId%5D/apply/page.tsx)
- [Create Round](./apps/demo/src/app/admin/rounds/create/page.tsx)
- [Review Applications](./apps/demo/src/app/admin/rounds/%5BchainId%5D/%5BroundId%5D/page.tsx)
- [Metadata Upload API](./apps/demo/src/app/api/ipfs/route.ts)

### Development

```sh
# optional install bun
curl -fsSL https://bun.sh/install | bash

bun install # or npm | pnpm install

bun run dev

# Demo App
open http://localhost:3000

# Storybook
open http://localhost:6006
```
