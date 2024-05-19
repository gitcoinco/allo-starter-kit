"use client";
import { DiscoverApplications } from "@allo/ui";
import { RoundDetails } from "@allo/ui/round-details";
import Link from "next/link";

export default function RoundPage({ params: { chainId = 0, roundId = "" } }) {
  return (
    <section className="space-y-8">
      <RoundDetails id={roundId} opts={{ chainId }} />

      <h3 className="text-lg font-semibold">Approved Projects</h3>
      <DiscoverApplications
        query={{
          take: 12,
          where: {
            roundId: { equals: roundId },
            status: { equals: "APPROVED" },
          },
        }}
        renderItem={(application, Component) => (
          <Link
            href={`/${chainId}/projects/${application.projectId}`}
            key={application.id}
          >
            <Component {...application} />
          </Link>
        )}
      />
    </section>
  );
}
