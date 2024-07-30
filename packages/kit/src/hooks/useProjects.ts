"use client";
import { useWalletClient } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAPI } from "..";
import { API, ProjectInput, ProjectsQuery } from "../api/types";

const defaultQuery: ProjectsQuery = {
  where: {},
  offset: 0,
  first: 12,
  orderBy: { created_at_block: "asc" } as const,
};

export function useProjects(query: ProjectsQuery = defaultQuery) {
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
