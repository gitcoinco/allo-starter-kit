"use client";
import { ComponentType, ReactNode } from "react";
import { cn } from "./lib/cn";
import { useProjects } from "./hooks/useProjects";

type DiscoverRoundsProps = {
  roundId: string;
  columns?: number[];
  filter?: {
    limit?: number;
  };
  renderItem?: (
    project: Project,
    Component: ComponentType<Project>
  ) => ReactNode;
};

export function DiscoverProjects({
  roundId,
  columns = [1, 1, 3, 4],
  filter,
  renderItem = (project, Component) => <Component {...project} />,
}: DiscoverRoundsProps) {
  const [xs, sm, md, lg, xl] = columns;

  const { data } = useProjects({ roundId });

  return (
    <div className={cn("grid grid-cols-3 gap-4")}>
      {data?.map((round) => renderItem(round, ProjectItem))}
    </div>
  );
}

type Project = { id: string; name: string };
function ProjectItem({ id, name }: Project) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-100 h-24" />
      <div className="p-2">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
      </div>
    </div>
  );
}
