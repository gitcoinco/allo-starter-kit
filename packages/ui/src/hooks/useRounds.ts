"use client";
import { useQuery } from "@tanstack/react-query";

type Compare = { equals?: string; in?: string[]; gte?: number };
type RoundQueryWhere = {
  id?: Compare;
  strategy?: Compare;
  createdAt?: Compare;
  AND?: RoundQueryWhere[];
};

// enum OrderBy {
//   asc = "asc",
//   desc = "desc",
// }

type OrderBy = "asc" | "desc";
export type RoundQuery = {
  where?: RoundQueryWhere;
  orderBy?: { [key: string]: OrderBy };
  skip?: number;
  take?: number;
};

const rounds = Array.from({ length: 100 }).map((_, id) => ({
  id: id.toString(),
  name: `Round ${id}`,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  createdAt: Date.now(),
  strategy: "0x...",
}));

const defaultQuery = {
  where: {},
  skip: 0,
  take: 12,
  orderBy: { createdAt: "asc" } as const,
};
export function useRounds(query: RoundQuery = defaultQuery) {
  return useQuery({
    queryKey: ["rounds", query],
    queryFn: async () => {
      return rounds.slice(
        query.skip,
        (query.skip ?? Infinity) + (query.take ?? Infinity)
      );
    },
  });
}

export function useRoundById(id: string) {
  return useQuery({
    queryKey: ["round", id],
    queryFn: async () => {
      return rounds.find((r) => r.id === id);
    },
  });
}
