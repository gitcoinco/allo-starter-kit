"use client";
import { Markdown } from "../ui/markdown";
import { QueryOpts } from "../api/types";
import { useApplicationById } from "../hooks/useApplications";
import { BackgroundImage } from "../ui/background-image";
import { ApplicationStatusBadge } from "./status-badge";
import { ReactNode } from "react";

type ApplicationDetailsProps = {
  id: string;
  opts?: QueryOpts;
  action?: ReactNode;
};

export function ApplicationDetails({
  id,
  opts,
  action,
}: ApplicationDetailsProps) {
  const { data, isPending } = useApplicationById(id, opts);

  console.log(id, opts, data);
  return (
    <div className={"space-y-4"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-medium">{data?.name}</h1>
          <ApplicationStatusBadge status={data?.status} />
        </div>
        {action}
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
