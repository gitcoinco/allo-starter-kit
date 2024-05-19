"use client";

import { Round, RoundsQuery } from "../api/providers/types";
import { useRounds } from "../hooks/useRounds";
import { Grid, GridProps } from "../ui/grid";
import { TokenAmount } from "../ui/token-amount";

export function DiscoverRounds({
  query,
  ...props
}: GridProps<Round> & { query?: RoundsQuery }) {
  const rounds = useRounds(query!);
  return <Grid component={RoundItem} {...rounds} {...props} />;
}

function RoundItem({ name, chainId, applications, matching }: Round) {
  return (
    <div className="border rounded-xl overflow-hidden h-64">
      <div className="bg-gray-100 h-24" />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        <div className="">
          <TokenAmount {...matching} />
        </div>
        <div className="">{applications?.length} projects</div>
        <div className="">Network: {chainId}</div>
      </div>
    </div>
  );
}
