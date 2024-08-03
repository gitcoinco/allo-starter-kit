"use client";
import { Markdown } from "../ui/markdown";
import { QueryOpts } from "../api/types";
import { useApplicationById } from "../hooks/useApplications";
import { BackgroundImage } from "../ui/background-image";
import { ApplicationStatusBadge } from "./status-badge";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

type PageActions = { backAction?: ReactNode; primaryAction?: ReactNode };

type ApplicationDetailsProps = {
  id: string;
  roundId: string;
  chainId: number;
  opts?: QueryOpts;
};

export function ApplicationDetails({
  id,
  chainId,
  roundId,
  opts,
  backAction,
  primaryAction,
}: ApplicationDetailsProps & PageActions) {
  const { data, isPending } = useApplicationById(id, { roundId, chainId });
  return (
    <div className={"space-y-4"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {backAction}
          {isPending ? (
            <Skeleton className="mb-2 h-10 w-96" />
          ) : (
            <h1 className="text-3xl font-medium">{data?.name}</h1>
          )}

          {isPending ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <ApplicationStatusBadge status={data?.status} />
          )}
        </div>
        {primaryAction}
      </div>
      <BackgroundImage
        className="h-64 rounded-xl bg-gray-100"
        isLoading={isPending}
        src={data?.bannerUrl}
      />
      <Markdown>{data?.description}</Markdown>
    </div>
  );
}
