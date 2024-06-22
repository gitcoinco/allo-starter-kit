"use client";
import {
  DiscoverApplications,
  DiscoverProjects,
  grantsStackAPI,
} from "@allo/kit";
import Image from "next/image";
import { Projects } from "./projects";

export default function Home() {
  return (
    <main>
      <Projects />
    </main>
  );
}
