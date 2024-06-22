import {
  Button,
  FundRound,
  Markdown,
  ProjectDetails,
  RoundNetworkBadge,
  RoundStrategyBadge,
} from "@allo/kit";
import { grantsStackAPI } from "@allo/kit";
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "@allo/kit";
import { notFound } from "next/navigation";
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
  // const round = await grantsStackAPI.roundById?.(roundId, { chainId });
  // if (!round) return notFound();
  return (
    <div>
      <ProjectDetails id={projectId} />
    </div>
  );
}
