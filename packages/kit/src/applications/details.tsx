"use client";
import { Markdown } from "../ui/markdown";
import { QueryOpts } from "../api/types";
import { useApplicationById } from "../hooks/useApplications";
import { BackgroundImage } from "../ui/background-image";
import { ApplicationStatusBadge } from "./status-badge";
import { ReactNode } from "react";

type ApplicationDetailsProps = {
  id: string;
  roundId: string;
  chainId: number;
  opts?: QueryOpts;
  action?: ReactNode;
};

export function ApplicationDetails({
  id,
  chainId,
  roundId,
  opts,
  action,
}: ApplicationDetailsProps) {
  const { data, isPending } = useApplicationById(id, { roundId, chainId });
  console.log("data", data);
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

      <h3 className="text-xl font-semibold">Application answers</h3>
      <ul className="list-decimal space-y-4 pl-4">
        {data?.answers?.map((answer) => (
          <li>
            <div className="font-semibold">{answer.question}</div>
            <div className="whitespace-pre-wrap">
              {answer.hidden ? "<hidden>" : answer.answer}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
