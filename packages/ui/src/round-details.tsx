"use client";
import { useRoundById } from "./hooks/useRounds";

type RoundDetailsProps = {
  id: string;
};

export function RoundDetails({ id }: RoundDetailsProps) {
  const { data } = useRoundById(id);
  return (
    <div className={""}>
      <div className="bg-gray-100 h-48" />
      <h1 className="text-2xl font-medium">{data?.name}</h1>
      <p>{data?.description}</p>
    </div>
  );
}
