import { MintingProject } from "../../../types/projects";

export type TopProjectProps = {
  project: MintingProject;
};

export const TopProject = ({ project }: TopProjectProps) => {
  const { rank, image, name, round } = project;
  return (
    <div className="flex h-28 flex-1 items-center justify-start gap-4 border-b border-r border-black p-8">
      <div className="font-mono text-[23.04px]/[30px] font-medium text-black">{rank}</div>
      <img
        className="aspect-square size-12 rounded-full border border-[#eaeaea]"
        alt="Project"
        src={image}
      />

      <div className="flex flex-col items-start justify-center gap-2 truncate">
        <div className="max-w-full truncate font-modern-era text-2xl/[24px] font-medium text-black">
          {name}
        </div>
        <div className="max-w-full truncate font-modern-era text-base/[16px] font-medium text-black">
          {round}
        </div>
      </div>
    </div>
  );
};
