"use client";

import { Round, RoundsQuery } from "../api/providers/types";
import { useRounds } from "../hooks/useRounds";
import { Grid, GridProps } from "../ui/grid";

export function DiscoverRounds({
  query,
  ...props
}: GridProps<Round> & { query?: RoundsQuery }) {
  const rounds = useRounds(query!);
  return <Grid component={RoundItem} {...rounds} {...props} />;
}

function RoundItem({ name, chainId, applications }: Round) {
  return (
    <div className="border rounded-xl overflow-hidden h-48">
      <div className="bg-gray-100 h-24" />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        <div className="text-xs">Network: {chainId}</div>
        <div className="text-xs">{applications?.length} projects</div>
      </div>
    </div>
  );
}
