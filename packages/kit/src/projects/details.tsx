"use client";
import { Markdown } from "..";
import { QueryOpts } from "../api/types";
import { useProjectById } from "../hooks/useProjects";
import { BackgroundImage } from "../ui/background-image";

type ProjectDetailsProps = {
  id: string;
  opts?: QueryOpts;
};

export function ProjectDetails({ id, opts }: ProjectDetailsProps) {
  const { data, isPending } = useProjectById(id, opts);

  return (
    <div className={"space-y-4"}>
      <h1 className="text-2xl font-semibold">{data?.name}</h1>
      <BackgroundImage
        className="h-64 rounded-xl bg-gray-100"
        isLoading={isPending}
        src={data?.bannerUrl}
      />
      <Markdown>{data?.description}</Markdown>
    </div>
  );
}
