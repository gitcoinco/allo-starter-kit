"use client";
import { ReactNode } from "react";
import { Markdown } from "..";
import { QueryOpts } from "../api/types";
import { useRoundById } from "../hooks/useRounds";

type RoundDetailsProps = {
  id: string;
  opts?: QueryOpts;
  backAction?: ReactNode;
  primaryAction?: ReactNode;
};

export function RoundDetails({
  id,
  opts,
  backAction,
  primaryAction,
}: RoundDetailsProps) {
  const { data } = useRoundById(id, opts);
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {backAction}
          <h1 className="text-3xl font-medium">{data?.name}</h1>
        </div>
        <div>{primaryAction}</div>
      </div>
      <Markdown className={"prose-xl"}>{data?.description}</Markdown>
    </section>
  );
}
