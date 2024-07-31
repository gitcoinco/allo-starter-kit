"use client";
import { Markdown } from "../ui/markdown";
import { useApplicationById } from "../hooks/useApplications";
import { BackgroundImage } from "../ui/background-image";
import { ApplicationStatusBadge } from "./status-badge";
import { ReactNode } from "react";

type ApplicationDetailsProps = {
  id: string;
  roundId: string;
  chainId: number;
  action?: ReactNode;
};

export function ApplicationDetails({
  id,
  chainId,
  roundId,
  action,
}: ApplicationDetailsProps) {
  const { data, isPending } = useApplicationById(id, { roundId, chainId });

  const {
    status,
    project: {
      metadata: {
        title = "",
        description = "",
        logoImg = "",
        bannerImg = "",
      } = {},
    } = {},
  } = data || {};
  return (
    <div className={"space-y-4"}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-medium">{title}</h1>
          <ApplicationStatusBadge status={status} />
        </div>
        {action}
      </div>
      <BackgroundImage
        className="h-64 rounded-xl bg-gray-100"
        isLoading={isPending}
        src={bannerImg}
      />
      <Markdown>{description}</Markdown>
    </div>
  );
}
