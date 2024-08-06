"use client";

import type { Project, RoundsQuery } from "../api/types";
import { useProjects } from "../hooks/useProjects";
import { Grid, type GridProps } from "../ui/grid";

export function DiscoverProjects({
  query,
  ...props
}: GridProps<Project> & { query?: RoundsQuery }) {
  const projects = useProjects(query!);
  return <Grid component={ProjectItem} {...projects} {...props} />;
}
function ProjectItem({ name }: Project) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="h-24 bg-gray-100" />
      <div className="p-2">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      </div>
    </div>
  );
}
