"use client";
import { DiscoverRounds } from "@allo/ui/discover-rounds";
import { ConnectButton } from "@allo/ui/connect-button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="py-4 border-b">
        <ConnectButton />
      </header>

      <DiscoverRounds
        renderItem={(round, Component) => (
          <Link href={`/round/${round.id}`}>
            <Component {...round} />
          </Link>
        )}
      />
    </div>
  );
}
