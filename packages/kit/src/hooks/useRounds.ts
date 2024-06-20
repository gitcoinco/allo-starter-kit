"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API, AllocateInput, RoundInput, RoundsQuery } from "../api/types";
import { useAPI } from "..";
import { useWalletClient } from "wagmi";
import { useToast } from "../ui/use-toast";

const defaultQuery = {
  where: {},
  skip: 0,
  take: 12,
  // orderBy: { createdAt: "asc" } as const,
};

export function useRounds(query: RoundsQuery = defaultQuery) {
  const api = useAPI();
  console.log("use rounds", query);
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
  const { toast } = useToast();
  const { data: client } = useWalletClient();
  return useMutation({
    mutationFn: (data: RoundInput) => api.createRound(data, client!),
    onSuccess: () => toast({ title: "Round created!" }),
    onError: (err) => toast({ variant: "destructive", title: err.toString() }),
  });
}
