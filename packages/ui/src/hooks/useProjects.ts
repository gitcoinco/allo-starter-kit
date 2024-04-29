"use client";
import { useQuery } from "@tanstack/react-query";

const projects = Array.from({ length: 12 }).map((_, id) => ({
  id: id.toString(),
  name: `Project ${id}`,
  descrption: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
}));

export function useProjects(params) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      return projects;
    },
  });
}

export function useProjectById(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      return projects.find((r) => r.id === id);
    },
  });
}
