"use client";
import {
  ApplicationsTableWithHook as ApplicationsTable,
  Button,
  BackButton,
  RoundDetailsWithHook as RoundDetails,
  RoundEligibilityWithHook as RoundEligibility,
} from "@allo-team/kit";
import Link from "next/link";

export default function RoundPage({ params: { chainId = 0, roundId = "" } }) {
  return (
    <section className="space-y-8">
      <RoundDetails
        roundId={roundId}
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
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Eligibility</h3>
        <RoundEligibility roundId={roundId} chainId={chainId} />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Applications</h3>
        <ApplicationsTable
          roundId={roundId}
          chainId={chainId}
          renderLink={({ id }) => (
            <Link href={`/admin/applications/${chainId}/${roundId}/${id}`}>
              <Button variant={"ghost"}>View</Button>
            </Link>
          )}
        />
      </div>
    </section>
  );
}
