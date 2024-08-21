"use client";
import type { Project, QueryOpts } from "../api/types";
import { Avatar, AvatarFallback, AvatarImage, Markdown } from "..";
import { useProjectById } from "../hooks/useProjects";
import { BackgroundImage } from "../ui/background-image";
import { ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";

type PageActions = { backAction?: ReactNode; primaryAction?: ReactNode };

export function ProjectDetailsWithHook({
  id,
  chainId,
  ...props
}: {
  id: string;
  chainId?: number;
  opts?: QueryOpts;
} & PageActions) {
  return <ProjectDetails {...useProjectById(id)} {...props} />;
}

export function ProjectDetails({
  data,
  isPending,
  error,
  backAction,
  primaryAction,
}: Partial<UseQueryResult<Project | undefined, unknown>> & PageActions) {
  return (
    <div className={"space-y-4"}>
      <h1 className="text-2xl font-semibold">{data?.name}</h1>
      <div className="">
        <BackgroundImage
          className="h-64 rounded-xl bg-gray-100"
          isLoading={isPending}
          src={data?.bannerUrl}
        />
        <div className="-mt-16 ml-8 inline-flex rounded-full bg-white p-0.5">
          <Avatar className="size-32">
            <AvatarImage src={data?.avatarUrl} alt={data?.name} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>
      </div>
      <Markdown>{data?.description}</Markdown>
    </div>
  );
}
