"use client";
import { useQuery } from "@tanstack/react-query";
import { API } from "../api/providers/types";
import { useAPI } from "..";

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

type ApplicationByID = Parameters<API["applicationById"]>;
export function useApplicationById(
  id: ApplicationByID[0],
  opts?: ApplicationByID[1]
) {
  const api = useAPI();
  return useQuery({
    queryKey: ["application", { id, opts }],
    queryFn: async () => api.applicationById(id, opts),
    enabled: Boolean(id),
  });
}
