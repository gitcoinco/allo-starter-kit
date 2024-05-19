"use client";
import { Markdown } from ".";
import { QueryOpts } from "./api/providers/types";
import { useProjectById } from "./hooks/useProjects";
import { BackgroundImage } from "./ui/background-image";

type ProjectDetailsProps = {
  id: string;
  opts?: QueryOpts;
};

export function ProjectDetails({ id, opts }: ProjectDetailsProps) {
  const { data, isPending } = useProjectById(id, opts);
  return (
    <div className={"space-y-4"}>
      <BackgroundImage
        className="bg-gray-100 h-64"
        isLoading={isPending}
        src={data?.coverImageUrl}
      />
      <h1 className="text-2xl font-medium">{data?.name}</h1>
      <Markdown>{data?.description}</Markdown>
    </div>
  );
}
