"use client";
import { DiscoverProjects } from "@allo/ui/discover-projects";
import { RoundDetails } from "@allo/ui/round-details";
import Link from "next/link";

export default function RoundPage({ params: { roundId = "" } }) {
  return (
    <section className="space-y-8">
      <RoundDetails id={roundId} />

      <h3 className="text-lg font-semibold">Projects</h3>
      <DiscoverProjects
        roundId={roundId}
        renderItem={(project, Component) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Component {...project} />
          </Link>
        )}
      />
    </section>
  );
}
