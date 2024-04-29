"use client";
import { useProjectById } from "./hooks/useProjects";

type ProjectDetailsProps = {
  id: string;
};

export function ProjectDetails({ id }: ProjectDetailsProps) {
  const { data } = useProjectById(id);
  return (
    <div className={"space-y-4"}>
      <div className="bg-gray-100 h-48" />
      <h1 className="text-2xl font-medium">{data?.name}</h1>
      <p>{data?.descrption}</p>
    </div>
  );
}
