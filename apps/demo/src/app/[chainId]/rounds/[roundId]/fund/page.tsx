"use client";

import { CreateApplication, FundRound } from "@allo/kit";
import { useRouter } from "next/navigation";

export default function CreateApplicationPage({
  params: { roundId, chainId },
}: {
  params: { roundId: string; chainId: string };
}) {
  const router = useRouter();
  return (
    <section>
      <FundRound id={roundId} opts={{ chainId }} />
    </section>
  );
}
