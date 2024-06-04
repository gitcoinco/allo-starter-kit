"use client";

import { Round } from "../api/types";
import { TokenAmount } from "../ui/token-amount";

export function RoundCard({ name, chainId, applications, matching }: Round) {
  return (
    <div className="relative h-64 overflow-hidden rounded-3xl border shadow-xl">
      <div className="h-28 bg-gray-100" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <div className="">
          <TokenAmount {...matching} />
        </div>
        <div className="">{applications?.length} projects</div>
        <div className="">Network: {chainId}</div>
      </div>
    </div>
  );
}
