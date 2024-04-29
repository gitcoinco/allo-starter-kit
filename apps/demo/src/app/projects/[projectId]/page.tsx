import { ProjectDetails } from "@allo/ui/project-details";

export default function ProjectPage({ params: { projectId = "" } }) {
  return (
    <section className="space-y-8">
      <ProjectDetails id={projectId} />
    </section>
  );
}
