"use client";
import { useQuery } from "@tanstack/react-query";
import { API, useAPI } from "..";

const projects = Array.from({ length: 12 }).map((_, id) => ({
  id: id.toString(),
  chainId: 0,
  name: `Project ${id}`,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
}));

export function useProjects(query: Parameters<API["projects"]>[number]) {
  return useQuery({
    queryKey: ["projects", query],
    queryFn: async () => {
      return projects;
    },
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
