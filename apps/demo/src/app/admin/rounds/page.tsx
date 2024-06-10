"use client";
import { useAccount } from "wagmi";
import { DiscoverRounds } from "@allo/kit";
import Link from "next/link";

export default function AdminRounds() {
  const { address } = useAccount();
  return (
    <DiscoverRounds
      query={{
        where: {
          createdBy: { in: [address!] },
          // Only rounds where we are admin or manager
          roles: {
            address: { in: [String(address)] },
          },
        },
        orderBy: { created_at_block: "desc" },
        skip: 0,
        take: 12,
      }}
      renderItem={(round, Component) => (
        <Link
          href={`/admin/rounds/${round.id}?chainId=${round.chainId}/`}
          key={round.id}
        >
          <Component {...round} />
        </Link>
      )}
      columns={[1, 2, 3]}
    />
  );
}
