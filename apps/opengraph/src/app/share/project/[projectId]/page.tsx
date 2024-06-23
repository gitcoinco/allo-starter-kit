import {
  DiscoverApplications,
  DiscoverRounds,
  ProjectDetails,
} from "@allo/kit";
import { grantsStackAPI } from "@allo/kit";
import { Metadata } from "next";

export async function generateMetadata({
  params: { projectId },
}: {
  params: { projectId: string };
}): Promise<Metadata> {
  const project = await grantsStackAPI.projectById?.(projectId);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
  };
}
export default async function ShareProjectPage({ params: { projectId = "" } }) {
  return (
    <div>
      <ProjectDetails id={projectId} />
    </div>
  );
}
