"use client";
import { Markdown } from "..";
import { QueryOpts } from "../api/types";
import { useRoundById } from "../hooks/useRounds";

type RoundDetailsProps = {
  id: string;
  opts?: QueryOpts;
};

export function RoundDetails({ id, opts }: RoundDetailsProps) {
  const { data } = useRoundById(id, opts);
  return (
    <div className={""}>
      <h1 className="text-3xl mb-2 font-medium">{data?.name}</h1>
      <Markdown className={"prose-xl"}>{data?.description}</Markdown>
    </div>
  );
}
