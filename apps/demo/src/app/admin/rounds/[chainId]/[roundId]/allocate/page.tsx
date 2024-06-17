"use client";
import { Allocate } from "@allo/kit";

export default function AllocatePage({
  params: { chainId = 0, roundId = "" },
}) {
  console.log({ roundId, chainId });
  return (
    <section className="space-y-8">
      <Allocate id={roundId} opts={{ chainId }} />
    </section>
  );
}
