"use client";

import { CreateRound } from "@allo/kit";
import { useRouter } from "next/navigation";

export default function CreateRoundPage({}) {
  const router = useRouter();
  return (
    <section>
      <CreateRound
        strategies={["0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa"]}
        onCreated={({ id, chainId }) => {
          console.log("Round created", { id, chainId });
          router.push(`/admin/rounds/${chainId}/${id}`);
        }}
      />
    </section>
  );
}
