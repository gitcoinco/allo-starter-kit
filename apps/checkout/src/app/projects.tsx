"use client";

import {
  DiscoverApplications,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  supportedChains,
} from "@allo/kit";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function Projects() {
  const router = useRouter();
  const params = useSearchParams();

  const network = params.get("network") ?? "10";
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Popular Projects</h1>
        <div className="flex gap-4 items-center mb-4">
          <h3 className="text-gray-muted text-sm tracking-wider">Network</h3>
          <Select
            value={network}
            onValueChange={(val) => router.push(`/?network=${val}`)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Network" />
            </SelectTrigger>
            <SelectContent>
              {supportedChains?.map((network) => (
                <SelectItem value={String(network.id)}>
                  {network.prettyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DiscoverApplications
        columns={[3]}
        query={{
          where: {
            chainId: { in: [Number(network)] },
            status: { equals: "APPROVED" },
          },
          orderBy: {
            total_amount_donated_in_usd: "desc",
          },
          take: 24,
        }}
        renderItem={(application, Card) => (
          <Link
            key={application.id}
            href={`/share/project/${application.projectId}`}
          >
            <Card {...application} components={["contributors"]} />
          </Link>
        )}
      />
    </div>
  );
}
