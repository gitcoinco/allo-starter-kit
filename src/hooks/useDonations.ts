"use client";
import { useQuery } from "@tanstack/react-query";
import { DonationsQuery } from "../services/types";
import { useAPI } from "../services/provider";

const defaultQuery: DonationsQuery = {
  where: {},
  offset: 0,
  first: 12,
  orderBy: { created_at_block: "asc" } as const,
};
export function useDonations(query: DonationsQuery = defaultQuery) {
  const api = useAPI();
  return useQuery({
    queryKey: ["donations", query],
    queryFn: async () => api.indexer.donations(query),
  });
}
