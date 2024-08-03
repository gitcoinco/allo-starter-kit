"use client";
import {
  ApplicationsTableWithHook as ApplicationsTable,
  Button,
  BackButton,
  RoundDetailsWithHook as RoundDetails,
} from "@allo-team/kit";
import Link from "next/link";

export default function RoundPage({ params: { chainId = 0, roundId = "" } }) {
  return (
    <section className="space-y-8">
      <RoundDetails
        id={roundId}
        chainId={chainId}
        primaryAction={
          <Link href={`/admin/rounds/${chainId}/${roundId}/allocate`}>
            <Button>Allocate</Button>
          </Link>
        }
        backAction={
          <Link href={`/admin/rounds`}>
            <BackButton />
          </Link>
        }
      />

      <ApplicationsTable
        roundId={roundId}
        chainId={chainId}
        renderLink={({ id }) => (
          <Link href={`/admin/applications/${chainId}/${roundId}/${id}`}>
            <Button variant={"ghost"}>Open</Button>
          </Link>
        )}
      />
    </section>
  );
}
