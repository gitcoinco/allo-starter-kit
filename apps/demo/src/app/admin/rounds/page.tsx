"use client";
import { DiscoverRounds } from "@allo-team/kit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function AdminRounds() {
  const { address } = useAccount();
  if (!address) return <div>Connect your wallet</div>;
  return (
    <DiscoverRounds
      query={{
        where: {
          // Only rounds where we are admin or manager
          roles: {
            some: {
              address: { in: ["0xb425ec6d420732053fdec999f8e9738cf75efdbd"] },
            },
          },
          applications: {
            where: {
              status: { in: ["REJECTED"] },
            },
          },
        },
        orderBy: { created_at_block: "desc" },
        offset: 0,
        first: 12,
      }}
      renderItem={(round, Component) => (
        <Link
          href={`/admin/rounds/${round.chainId}/${round.id}`}
          key={round.id}
        >
          <Component {...round} />
        </Link>
      )}
      columns={[1, 2, 3]}
    />
  );
}
