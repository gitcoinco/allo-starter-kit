import { ProjectDetails } from "@allo/kit";

export default function ProjectPage({ params: { projectId = "" } }) {
  return (
    <section className="space-y-8">
      <ProjectDetails id={projectId} />
    </section>
  );
}
