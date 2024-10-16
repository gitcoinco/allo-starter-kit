import { useMutation } from "@tanstack/react-query";
import { useRoundStrategyAddon } from "../components/strategies";
import { Application, Round } from "../services/types";
import { useRef } from "react";

export function useAllocateState() {
  const state = useRef<Record<string, number>>({}).current;
  function set(id: string, amount: number) {
    state[id] = amount;
  }
  return { state, set };
}

export function useAllocate(round?: Round) {
  const strategyAddon = useRoundStrategyAddon("allocate", round);

  return useMutation({
    mutationFn: async ({
      applications,
      state,
    }: {
      applications?: Application[];
      state: Record<string, number>;
    }) => {
      return strategyAddon?.call.mutate([round, state, applications]);
    },
  });
}
