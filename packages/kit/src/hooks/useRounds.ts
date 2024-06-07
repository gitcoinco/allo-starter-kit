"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API, RoundInput, RoundsQuery } from "../api/types";
import { useAPI } from "..";
import { useWalletClient } from "wagmi";

const defaultQuery = {
  where: {},
  skip: 0,
  take: 12,
  orderBy: { createdAt: "asc" } as const,
};

export function useRounds(query: RoundsQuery = defaultQuery) {
  const api = useAPI();
  return useQuery({
    queryKey: ["rounds", query],
    queryFn: async () => api.rounds(query),
  });
}

type RoundParams = Parameters<API["roundById"]>;
export function useRoundById(id: RoundParams[0], opts?: RoundParams[1]) {
  const api = useAPI();
  return useQuery({
    queryKey: ["round", { id, opts }],
    queryFn: async () => api.roundById(id, opts),
    enabled: Boolean(id),
  });
}

export function useCreateRound() {
  const api = useAPI();
  const { data: client } = useWalletClient();
  return useMutation({
    mutationFn: (data: RoundInput) => api.createRound(data, client!),
    onSuccess: () => {}, // TODO: add toast
    onError: () => {},
  });
}
