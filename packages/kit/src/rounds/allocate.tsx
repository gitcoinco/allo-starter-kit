"use client";
import { NumericFormat } from "react-number-format";
import { useApplications } from "../hooks/useApplications";
import { useRoundById } from "../hooks/useRounds";
import { useStrategyAddon } from "../strategies";
import { BackgroundImage } from "../ui/background-image";
import { Input } from "../ui/input";
import { Button } from "..";
import { useRef } from "react";

type AllocateProps = {
  roundId: string;
  chainId: number;
};

function useAllocateState() {
  const state = useRef<Record<string, number>>({}).current;
  function set(id: string, amount: number) {
    state[id] = amount;
  }
  return { state, set };
}
export function Allocate({ roundId, chainId }: AllocateProps) {
  const { data: round } = useRoundById(roundId, { chainId });
  const { data: applications, isPending } = useApplications({
    where: {
      roundId: { equals: roundId },
      status: { equals: "APPROVED" },
      chainId: { equals: chainId },
    },
  });

  const strategyAddon = useStrategyAddon("allocate", round);
  const { state, set } = useAllocateState();

  return (
    <section>
      <div className="mb-2 flex justify-between">
        <div />
        <Button
          isLoading={strategyAddon?.call?.isPending}
          onClick={() => {
            console.log("call", round, state, applications);
            strategyAddon?.call?.mutate([round, state, applications]);
          }}
        >
          Allocate
        </Button>
      </div>
      <div className="divide-y">
        {applications?.map((application) => (
          <div key={application.id} className="flex items-center gap-2 py-2">
            <BackgroundImage
              className="size-12 rounded bg-gray-100"
              src={application.avatarUrl}
            />
            <h3 className="flex-1 text-lg">{application.name}</h3>

            <div>
              <NumericFormat
                min={0}
                allowNegative={false}
                allowLeadingZeros={false}
                thousandSeparator=","
                customInput={(p) => (
                  <Input className="w-32 text-center" {...p} min={0} />
                )}
                value={state[application.id] ?? 0}
                onBlur={(e) => {
                  e.preventDefault();
                  const value = parseFloat(e.target.value);
                  console.log(value);
                  value !== undefined && set(application.id, value);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
