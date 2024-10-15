import { MintingProject } from "../../../types/projects";
import { TopProject } from "./TopProject";

export type TopProjectsSectionProps = {
  projects?: MintingProject[];
};

export const TopProjectsSection = ({ projects = [] }: TopProjectsSectionProps) => {
  return (
    <div className="flex h-[407px] max-w-full flex-col">
      <div className="border-b border-r border-black px-8 py-4 font-mono text-[23.04px]/[30px] font-medium text-black">
        Top Projects
      </div>
      {projects.map((project, index) => (
        <TopProject key={index} project={project} />
      ))}
    </div>
  );
};
