"use client";
import { Markdown } from "..";
import { QueryOpts } from "../api/types";
import { useProjectById } from "../hooks/useProjects";
import { BackgroundImage } from "../ui/background-image";

type ProjectDetailsProps = {
  id: string;
  chainId: number;
  opts?: QueryOpts;
};

export function ProjectDetails({ id, chainId, opts }: ProjectDetailsProps) {
  const { data, isPending } = useProjectById(id, { chainId });

  const {
    metadata: {
      title = "",
      description = "",
      logoImg = "",
      bannerImg = "",
    } = {},
  } = data || {};

  return (
    <div className={"space-y-4"}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <BackgroundImage
        className="h-64 rounded-xl bg-gray-100"
        isLoading={isPending}
        src={bannerImg}
      />
      <Markdown>{description}</Markdown>
    </div>
  );
}
