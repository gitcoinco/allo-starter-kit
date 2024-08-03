"use client";
import { QueryOpts } from "../api/types";
import { useApplicationById } from "../hooks/useApplications";

type Props = {
  applicationId: string;
  roundId: string;
  chainId: number;
  opts?: QueryOpts;
};

export function ApplicationAnswers({ applicationId, chainId, roundId }: Props) {
  const { data, isPending } = useApplicationById(applicationId, {
    roundId,
    chainId,
  });
  return (
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
  );
}
