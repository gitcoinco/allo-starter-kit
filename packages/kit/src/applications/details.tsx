"use client";
import { Markdown } from "..";
import { QueryOpts } from "../api/types";
import { useApplicationById } from "../hooks/useApplications";
import { BackgroundImage } from "../ui/background-image";

type ApplicationDetailsProps = {
  id: string;
  opts?: QueryOpts;
};

export function ApplicationDetails({ id, opts }: ApplicationDetailsProps) {
  const { data, isPending } = useApplicationById(id, opts);
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
