# Allo Kit

AlloKit is a collection of functions, hooks, and components for interacting with the Allo Protocol and its Indexer.

## Table of Contents

1. [Introduction](#introduction)
2. [Stack](#stack)
3. [Using AlloKit in your project](#using-allokit-in-your-project)
   - [Install AlloKit in your project](#install-allokit-in-your-project) **OR** [Link AlloKit to your project](#link-allokit-to-your-project)
   - [Usage](#usage)
     - [Add Component Styles](#add-component-styles)
     - [Add AlloKit Providers](#add-allokit-providers)
     - [Import & Use Components](#import--use-components)
     - [Example usage in your project](#example-usage-in-your-project)
4. [Local Development](#local-development)
   - [Setup](#setup)
   - [Running the project](#running-the-project)
   - [Running the Demo App Standalone](#running-the-demo-app-standalone)
   - [Running Storybook Standalone](#running-storybook-standalone)
5. [Strategy Extensions](#strategy-extensions)

## Introduction

AlloKit is a collection of functions, hooks, and components for interacting with the Allo Protocol and its Indexer.

For example:

- Query Rounds, Applications, and Projects
- Create Rounds, Register and Approve Applications
- Allocate and Distribute

### Building a simple Discover Rounds app

https://www.loom.com/share/e7932c4da2e54902a3d9b66b69285f5e

## Stack

![image](https://github.com/gitcoinco/allo-starter-kit/assets/2961337/4eaabc4a-80a6-41ac-959c-bc2ee459831b)

## Using AlloKit in your project

### Install AlloKit in your project

💡 **PACKAGE NOT PUBLISHED YET!**

💡 **While we publish the package clone the repo and link it to your project. [Link to your project](#link-allokit-to-your-project)**

You can install it using either _npm_, _pnpm_, _yarn_ **or** _bun_

<details>
<summary>using npm</summary>

```sh
npm install @allo-team/kit
```

</details>

<details>
<summary>using yarn</summary>

```
yarn add @allo-team/kit
```

</details>

<details>
<summary>using pnpm</summary>

```sh
pnpm add @allo-team/kit
```

</details>

<details>
<summary>using bun</summary>

```sh
bun add @allo-team/kit
```

</details>

### Link AlloKit to your project

If the package is not yet published or if you want to modify AlloKit while including it in your project, you can link the package:

1. Link the package from the AlloKit project:

   ```sh
    bun run link
   ```

2. Link the package to your project:
   ```sh
    cd /path/to/your-project
    bun link @allo-team/kit --save
   ```

This will link the AlloKit package from the cloned repository to the project where you want to use it, allowing you to use it as if it were installed from npm package manager.

**Note:** Do not link AlloKit if you have already installed it using the previous step.

### Usage

Create a simple grants app [tutorial](./tutorial.md).

#### Add Component Styles

To use AlloKit's styles in your project, import the styles CSS file:

```tsx
import "@allo-team/kit/styles.css";
```

#### Add AlloKit Providers

To use AlloKit's context providers, add them to your application:

```tsx
"use client";
import { ApiProvider, Web3Provider } from "@allo-team/kit";

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

#### Import & Use Components

Depending on your app and use-cases you can use the kit in different ways. For example:

- **Direct function call** - This is useful when you want to query the indexer server-side
- **React Hooks** - Function calls are wrapped in ReactQuery hooks for loading & error states (plus more!)
- **React Components** - Ready-made components for common uses
  - **UI** - Simple design primitives like buttons and forms (see `packages/kit/src/ui`)
  - **Features** - Larger components often with a complete feature (CreateRound, DiscoverProjects, etc)

Example:

```tsx
import { DiscoverRounds, useRounds, indexer } from "@allo-team/kit";

export default function RoundsPage() {
  // Server-side
  const rounds = await indexer.rounds(query);

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
      // Customize how many columns for different screen-sizes [sm, md, lg, xl]
      columns={[1, 2, 3, 4]}
    />
  );
}

// Simple query
// Discover queries here: https://grants-stack-indexer-v2.gitcoin.co/graphiql
// (There are some differences in the queries. See packages/kit/src/api/types.d.ts)
const query = {
  where: { chainId: { in: [10] } },
  orderBy: { unique_donors_count: "desc" },
  offset: 0,
  first: 12,
};
```

See Storybook for more components: https://allo-starter-kit-storybook.vercel.app

### Example usage in your project

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

## Local Development

### Setup

#### Clone the Repository

```sh
git clone https://github.com/gitcoinco/allo-starter-kit
cd allo-starter-kit
```

#### Install bun

```sh
curl -fsSL https://bun.sh/install | bash
```

#### Install Dependencies

```sh
bun install
```

### Running the project

This will run the apps and the kit build in parallel

```sh
bun run dev
```

#### Open Demo App in your browser

```sh
open http://localhost:3000
```

#### Open Storybook in your browser

```sh
open http://localhost:6006
```

### Running the Demo App Standalone

This section covers how to run the demo app independently for local development.

#### Run Demo App

This will build the kit and run the demo app.

```sh
bun run dev:demo
```

#### Open Demo App in your browser

```sh
open http://localhost:3000
```

### Running Storybook Standalone

This section covers how to run Storybook independently for local development.

#### Run Storybook

This will build the kit and run storybook.

```sh
bun run storybook
```

## Strategy Extensions

The Allo Protocol is highly flexible in the types of strategies can be created. Different strategies might require different parameters and configurations.

The AlloKit provides a way to create StrategyExtensions where UI components are rendered based on the strategy in the correct components.

### Building a Strategy Extension

Let's use DirectGrantsLite as an example.

First we need to understand how Allo and strategies work:

**Allo.sol**

```solidity
// createPool invokes the strategy's initialize function
_strategy.initialize(poolId, _initStrategyData);
```

**DirectGrantsLite.sol**

```solidity
struct InitializeData {
    bool useRegistryAnchor;
    bool metadataRequired;
    uint64 registrationStartTime;
    uint64 registrationEndTime;
}

// the strategy's initialize function decodes the data
InitializeData memory initializeData = abi.decode(_data, (InitializeData));
```

Now, we want to include form components in CreateRound for the user to select start and end times. We also want to encode this into the strategy's InitializeData struct.

The CreateRound component (and many others) will look for a strategy extension for the current round (or the selected strategy in CreateRound).

If a matching strategy extension is found, it will render the custom UI component and extend the Zod form schema with the strategy extension.

Let's define a FormField with a RangeCalendar component to choose dates for registration start and end

```tsx
export function ChooseRegistrationTimes() {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      // See the schema definition for information about internal state
      name="initStrategyData.__internal__"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Project Registration</FormLabel>
            <RangeCalendar field={field}>
              Pick start and end dates
            </RangeCalendar>
            <FormDescription>
              When can projects submit their application?
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// Schema definition
export const directGrantsRoundSchema = z
  .object({
    /*
    initStrategyData expects to be a bytes string starting with 0x.
    Temporarily store from and to in an internal state. This will be encoded into the bytes string.
    */
    __internal__: z.object({ from: z.date(), to: z.date() }),
  })
  // Transform the dates into initStrategyData
  .transform((val) => {
    const { from, to } = val.__internal__;
    return DirectGrantsLiteStrategy.prototype.getInitializeData({
      useRegistryAnchor: false,
      metadataRequired: false,
      registrationStartTime: dateToUint64(from),
      registrationEndTime: dateToUint64(to),
    });
  });

// Define the DirectGrants Strategy Extension with the createRound component and schema
export const directGrants: StrategyExtension = {
  name: "Direct Grants Lite",
  type: "directGrants",
  // Deployed strategy contract address for all supported networks
  contracts: supportedChains.reduce(
    (acc, x) => ({ ...acc, [x.id]: x.contracts.directGrants }),
    {}
  ),
  components: {
    createRound: {
      schema: directGrantsRoundSchema,
      component: ChooseRegistrationTimes,
    },
    // We can also extend other components with strategy-specific functionality
    registerRecipient: { ... },
    reviewRecipients: { ... },
    allocate: { ... },
    distribute: { ... },
  },
};

// Finally we add the directGrants strategy to the AlloKit ApiProvider
<ApiProvider strategies={{ directGrants }}>...</ApiProvider>;
```
