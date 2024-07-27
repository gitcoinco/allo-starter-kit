"use client";

import { CreateProject } from "@allo/kit";
import { useRouter } from "next/navigation";

export default function CreateProjectPage({}) {
  const router = useRouter();
  return (
    <section>
      <CreateProject
        onCreated={({ id, chainId }) => {
          console.log("Project created", { id, chainId });
          router.push(`/${chainId}/projects/${id}`);
        }}
      />
    </section>
  );
}
