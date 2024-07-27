"use client";

import { DiscoverApplications } from "@allo/kit";
import Link from "next/link";

export function Applications({ roundId = "", chainId = 0 }) {
  return (
    <DiscoverApplications
      columns={[3]}
      query={{
        where: {
          roundId: { equals: roundId },
          chainId: { equals: chainId },
          status: { equals: "APPROVED" },
        },
        orderBy: {
          total_amount_donated_in_usd: "desc",
        },
        take: 12,
      }}
      renderItem={(application, Card) => (
        <Link
          key={application.key}
          href={`/share/project/${application.projectId}`}
        >
          <Card {...application} components={["contributors"]} />
        </Link>
      )}
    />
  );
}
