"use client";
import { NumericFormat } from "react-number-format";
import { QueryOpts } from "../api/types";
import { useApplications } from "../hooks/useApplications";
import { useRoundById } from "../hooks/useRounds";
import { useStrategyAddon } from "../strategies";
import { BackgroundImage } from "../ui/background-image";
import { Input } from "../ui/input";
import { Button } from "..";

type AllocateProps = {
  id: string;
  opts?: QueryOpts;
};

export function Allocate({ id, opts }: AllocateProps) {
  const { data: round } = useRoundById(id, opts);
  const { data: applications, isPending } = useApplications({
    where: { roundId: { equals: id }, status: { equals: "APPROVED" } },
  });

  console.log("appl", applications);

  const strategyAddon = useStrategyAddon("allocate", round);

  console.log(strategyAddon);

  const allocation = 0;
  return (
    <section>
      <div className="mb-2 flex justify-between">
        <div />
        <Button>Allocate</Button>
      </div>
      <div className="flex flex-col gap-2 divide-y">
        {applications?.map((application) => (
          <div key={application.id} className="flex items-center gap-2">
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
                customInput={(p) => (
                  <Input
                    className="w-16 text-center"
                    {...p}
                    max={100}
                    min={0}
                  />
                )}
                value={allocation}
                onBlur={(e) => {
                  e.preventDefault();
                  // const updated = parseFloat(e.target.value);
                  // allocation !== updated && set(id, updated);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
