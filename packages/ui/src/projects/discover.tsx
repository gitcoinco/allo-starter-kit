"use client";

import { Project, RoundsQuery } from "../api/types";
import { useProjects } from "../hooks/useProjects";
import { Grid, GridProps } from "../ui/grid";

export function DiscoverProjects({
  query,
  ...props
}: GridProps<Project> & { query?: RoundsQuery }) {
  const projects = useProjects(query!);
  return <Grid component={ProjectItem} {...projects} {...props} />;
}
function ProjectItem({ name }: Project) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-100 h-24" />
      <div className="p-2">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
      </div>
    </div>
  );
}
