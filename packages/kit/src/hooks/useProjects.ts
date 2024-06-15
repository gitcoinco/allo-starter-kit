"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAPI } from "..";
import { API, ProjectInput, RoundsQuery } from "../api/types";
import { useWalletClient } from "wagmi";

const defaultQuery = {
  where: {},
  skip: 0,
  take: 12,
  orderBy: { createdAt: "asc" } as const,
};

export function useProjects(query: RoundsQuery = defaultQuery) {
  const api = useAPI();
  return useQuery({
    queryKey: ["projects", query],
    queryFn: async () => api.projects(query),
  });
}

type ProjectByID = Parameters<API["projectById"]>;
export function useProjectById(id: ProjectByID[0], opts?: ProjectByID[1]) {
  const api = useAPI();
  return useQuery({
    queryKey: ["project", { id, opts }],
    queryFn: async () => api.projectById(id, opts),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const api = useAPI();
  const { data: client } = useWalletClient();
  return useMutation({
    mutationFn: (data: ProjectInput) => api.createProject(data, client!),
  });
}
