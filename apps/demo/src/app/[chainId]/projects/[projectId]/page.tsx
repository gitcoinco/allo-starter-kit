import { ProjectDetails } from "@allo/ui";

export default function ProjectPage({
  params: { chainId = 0, projectId = "" },
}) {
  return (
    <section className="space-y-8">
      <ProjectDetails id={projectId} opts={{ chainId }} />
    </section>
  );
}
