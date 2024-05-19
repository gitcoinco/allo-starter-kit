"use client";
import { useQuery } from "@tanstack/react-query";
import { API, useAPI } from "..";

const defaultQuery = {
  where: {},
  skip: 0,
  take: 12,
  orderBy: { createdAt: "asc" } as const,
};
export function useApplications(
  query: Parameters<API["applications"]>[number] = defaultQuery
) {
  const api = useAPI();
  return useQuery({
    queryKey: ["applications", query],
    queryFn: async () => api.applications(query),
  });
}
