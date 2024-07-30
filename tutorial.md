# Creating a simple grants app

Let's create a simple grants app using Next.js and AlloKit.

```sh
# Create a new Next.js app
npx create-next-app@latest allo-app


# Navigate to folder and add AlloKit to package.json
bun add @allo-team/kit
```

### Configuring Providers

AlloKit has two providers:

- **ApiProvider** - Queries the Indexer and interacts with the Allo Protocol contracts
- **Web3Provider** - Wagmi and RainbowKit to connect wallets

Create a new file `src/providers.tsx`.

```tsx
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
```

Update `src/layout.tsx` to add the providers and define a simple layout.

```tsx
...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlloKitProviders>
          <main className="max-w-screen-lg mx-auto py-16">{children}</main>
        </AlloKitProviders>
      </body>
    </html>
  );
```

### Create Round Page

```tsx
"use client";

import { useRouter } from "next/navigation";
import { CreateRound } from "@allo/kit";

export default function CreateRoundPage({}) {
  const router = useRouter();
  return (
    <CreateRound
      onCreated={({ id, chainId }) => router.push(`/${chainId}/rounds/${id}`)}
    />
  );
}
```

### Discover Rounds Page

Create a new file: `src/rounds/page.tsx`.

```tsx
import Link from "next/link";
import { DiscoverRounds } from "@allo/kit";

export default function DiscoverRoundsPage() {
  return (
    <DiscoverRounds
      query={{
        where: {
          // Only show rounds on Optimism
          chainId: { in: [10] },
          // With the DirectGrantsLite strategy (we can add more to this array or leave empty for all)
          strategyName: { in: ["allov2.DirectGrantsLiteStrategy"] },
        },
        // Sort by top donated rounds
        orderBy: { total_amount_donated_in_usd: "desc" },
        // We can implement pagination here later
        skip: 0,
        take: 12,
      }}
      // Wrap the RoundCard in a Link (both roundId and chainId are required to query the round)
      renderItem={(round, Round) => (
        <Link href={`/${round.chainId}/rounds/${round.id}`} key={round.key}>
          <Round {...round} />
        </Link>
      )}
      columns={[1, 2, 3]}
    />
  );
}
```

This will render a grid of round cards that links to a round details page.

### Round Details Page

Create the file `src/rounds/[chainId]/[roundId]/page.tsx`.

```tsx
import {
  Button,
  BackButton,
  DiscoverApplications,
  RoundDetailsWithHook as RoundDetails,
} from "@allo/kit";
import Link from "next/link";

export default function RoundPage({ params: { chainId = 0, roundId = "" } }) {
  return (
    <section className="space-y-8">
      <RoundDetails
        id={roundId}
        chainId={chainId}
        // Provide a button to navigate back to home page
        backAction={
          <Link href={`/`}>
            <BackButton />
          </Link>
        }
        primaryAction={
          <Link href={`/${chainId}/rounds/${roundId}/apply`}>
            <Button>Apply to Round</Button>
          </Link>
        }
      />

      <h3 className="text-lg font-semibold">Approved Projects</h3>
      <DiscoverApplications
        columns={[1, 3]}
        query={{
          take: 12,
          where: {
            // Get the approved Applications for the round
            roundId: { equals: roundId },
            status: { equals: "APPROVED" },
          },
        }}
        renderItem={(application, Application) => (
          <Link
            href={`/${chainId}/projects/${application.id}`}
            key={application.id}
          >
            <Application {...application} />
          </Link>
        )}
      />
    </section>
  );
}
```

This will display the round details and a list of approved applications. Each application links to an application details page.

### Apply to Round Page

Create the file `src/rounds/[chainId]/[roundId]/apply/page.tsx`.

```tsx
"use client";

import { useRouter } from "next/navigation";
import { CreateApplication } from "@allo/kit";

export default function CreateApplicationPage({
  params: { roundId, chainId },
}: {
  params: { roundId: string; chainId: string };
}) {
  const router = useRouter();
  return (
    <section>
      <CreateApplication
        chainId={chainId}
        roundId={roundId}
        onCreated={({ id, chainId }) =>
          router.push(`/${chainId}/applications/${id}`)
        }
      />
    </section>
  );
}
```

The CreateApplication component will automatically render the required forms for this round. This is based on the strategy the round was created with.

In AlloKit there are StrategyExtensions that allow developers to customize the behaviour of common components such as CreateRound, CreateApplication, ReviewApplications etc. In this case, the application for DirectGrantsLite expects an encoded byte string of `recipientAddress` and `metadata`. If you're curious about seeing how this works, have a look in the AlloKit source code (`src/strategies/direct-grants`).

When the application has been created we navigate the user to the application details page.

### Application Details Page

Create the file: `src/[chainId]/applications/[applicationId]/page.tsx`.

```tsx
import {
  ApplicationsDetails,
  Button,
  useIsRoundAdmin,
  useApproveApplication,
} from "@allo/kit";

export default function ApplicationDetailsPage({
  params: { chainId = 0, applicationId = "" },
}) {
  const isRoundAdmin = useIsRoundAdmin();
  const review = useReviewApplication();
  return (
    <ApplicationsDetails
      id={applicationId}
      chainId={chainId}
      actions={
        // Show Approve and Reject buttons
        isRoundAdmin
          ? [
              <Button
                isLoading={review.isPending && review.variables.status === 2}
                onClick={() => review.mutate({ id: applicationId, status: 2 })}
              >
                Approve
              </Button>,
              <Button
                isLoading={review.isPending && review.variables.status === 1}
                onClick={() => review.mutate({ id: applicationId, status: 1 })}
              >
                Reject
              </Button>,
            ]
          : undefined
      }
    />
  );
}
```

This will show the application details and if the user is a round admin it will render Approve and Reject buttons.

Checking for `review.variables.status` in `isLoading` makes sure we only show loading on the button that was clicked.

### Admin Pages

- View Applications (and approve/reject multiple)
- Distribute tokens