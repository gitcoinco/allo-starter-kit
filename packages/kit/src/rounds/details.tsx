"use client";
import type { ReactNode } from "react";
import { Markdown } from "..";
import type { QueryOpts, Round } from "../api/types";
import { useRoundById } from "../hooks/useRounds";
import { RoundNetworkBadge } from "./network-badge";
import type { UseQueryResult } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

type PageActions = { backAction?: ReactNode; primaryAction?: ReactNode };

/*
We provide two components for flexibility.

WithHook accepts roundId and chainId to query the indexer
RoundDetails is just the view component
*/

export function RoundDetailsWithHook({
  roundId,
  chainId,
  ...props
}: {
  roundId: string;
  chainId: number;
  opts?: QueryOpts;
} & PageActions) {
  return <RoundDetails {...useRoundById(roundId, { chainId })} {...props} />;
}

export function RoundDetails({
  data,
  isPending,
  error,
  backAction,
  primaryAction,
}: Partial<UseQueryResult<Round | undefined, unknown>> & PageActions) {
  return (
    <section className="space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {backAction}
          <div className="">
            {isPending ? (
              <Skeleton className="mb-2 h-10 w-96" />
            ) : (
              <h1 className="text-3xl font-medium">{data?.name}</h1>
            )}

            {isPending ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <RoundNetworkBadge chainId={data?.chainId} />
            )}
          </div>
        </div>
        <div>{primaryAction}</div>
      </div>
      {isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      ) : (
        <Markdown className={"prose-xl"}>{data?.description}</Markdown>
      )}
    </section>
  );
}
