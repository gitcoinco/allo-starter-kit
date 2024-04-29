"use client";
import { ComponentType, ReactNode } from "react";
import { cn } from "./lib/cn";
import { RoundQuery, useRounds } from "./hooks/useRounds";

type Round = { id: string; name: string; strategy: string; createdAt: number };

type DiscoverRoundsProps = {
  columns?: number[];
  query?: RoundQuery;
  renderItem?: (round: Round, Component: ComponentType<Round>) => ReactNode;
};

export function DiscoverRounds({
  columns = [1, 1, 3, 4],
  query,
  renderItem = (round, Component) => <Component {...round} />,
}: DiscoverRoundsProps) {
  const { data } = useRounds(query);

  return (
    <div className={cn("grid grid-cols-3 gap-4")}>
      {data?.map((round) => renderItem(round, RoundItem))}
    </div>
  );
}

function RoundItem({ id, name }: Round) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-100 h-24" />
      <div className="p-2">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
      </div>
    </div>
  );
}
