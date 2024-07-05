# Allo Kit

AlloKit is a collection of functions, hooks, and components for interacting with the Allo Protocol and its Indexer.

For example:

- Query Rounds, Applications, and Projects
- Create Rounds, Register and Approve Applications

### Getting Started

```sh
bun add @allo/kit # or npm i -S @allo/kit
```

> 💡 **Package not been published yet!**
>
> For now, use `bun link` in `/packages/kit` folder and then `bun link @allo/kit --save` in project folder

#### 1. Add Component Styles

```tsx
import "@allo/kit/styles.css";
```

#### 2. Add AlloKit Providers

```tsx
"use client";
import { ApiProvider, Web3Provider } from "@allo/kit";

export function AlloKitProviders({ children }: PropsWithChildren) {
  return (
    <ApiProvider api={{ upload }}>
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
}
// Provide Upload metadata API
// See `apps/demo/src/app/api/ipfs/route.ts` for example implementation
async function upload(data) {
  return fetch(`/api/ipfs`, { method: "POST", body: data })
    .then((r) => r.json())
    .then((r) => r.cid);
}
```

#### 3. Import & Use Components

Depending on your app and use-cases you can use the kit in different ways. For example:

- Server-side
- React Hooks
- React Components

```tsx
import { DiscoverRounds, useRounds, grantsStackAPI } from "@allo/kit";

export default function RoundsPage() {
  // Server-side
  const rounds = await grantsStack.rounds(query);

  // Or using hooks (remember to "use client" at top of file)
  const { data, error, isPending } = useRounds(query);

  // Or render ready-made component
  return (
    <DiscoverRounds
      query={query}
      // Optional renderItem function to wrap in Link component
      renderItem={({ key, ...round }, RoundCard) => (
        <Link key={key} href={`/${round.chainId}/rounds/${round.id}`}>
          <RoundCard {...round} />
        </Link>
      )}
    />
  );
}

// Simple query
// Discover queries here: https://grants-stack-indexer-v2.gitcoin.co/graphiql
// (There are some differences in the queries. See packages/kit/src/api/types.d.ts)
const query = {
  where: { chainId: { in: [10] } },
  orderBy: { unique_donors_count: "desc" },
  skip: 0,
  take: 12,
};
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
