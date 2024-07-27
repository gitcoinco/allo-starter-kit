"use client";
import { useAccount } from "wagmi";
import { DiscoverRounds } from "@allo/kit";
import Link from "next/link";

export default function AdminRounds() {
  const { address } = useAccount();
  if (!address) return <div>Connect your wallet</div>;
  return (
    <DiscoverRounds
      query={{
        where: {
          strategyName: {
            in: ["allov2.DirectGrantsLiteStrategy"],
          },
          // chainId: { in: [11155111] },
          // createdBy: { in: [address!] },
          // Only rounds where we are admin or manager
          // roles: {
          //   address: { in: [String(address)] },
          // },
        },
        orderBy: { created_at_block: "desc" },
        skip: 0,
        take: 12,
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
