import useColorAndBackground from "../../hooks/useColorAndBackground";
import { MintingProject } from "../../types/projects";
import { HeaderSection, StatsSection, TopProjectsSection, TopRoundSection } from "./components";

export type MintingAttestationFrameProps = {
  frameId: string;
  selectedBackground: string;
  topRound: string;
  projectsFunded: number;
  roundsSupported: number;
  checkedOutChains: number;
  projects: MintingProject[];
  address: string | undefined;
  ensName: string | null | undefined;
};

export const MintingAttestationFrame = ({
  frameId,
  selectedBackground,
  topRound,
  projectsFunded,
  roundsSupported,
  checkedOutChains,
  projects,
  address,
  ensName,
}: {
  frameId: string;
  selectedBackground: string;
  topRound: string;
  projectsFunded: number;
  roundsSupported: number;
  checkedOutChains: number;
  projects: MintingProject[];
  address: string | undefined;
  ensName: string | null | undefined;
}) => {
  const { attestationFrameLogo } = useColorAndBackground();

  return (
    <div
      className="relative flex h-[800px] w-[800px] flex-col items-center overflow-hidden rounded-[32px] bg-cover bg-center bg-no-repeat px-[50px] py-[54px]"
      id={`attestation-impact-frame-${frameId}`}
      style={{
        backgroundImage: `url(${selectedBackground})`,
      }}
    >
      <div className="flex h-full w-full flex-col rounded-lg border border-black bg-white bg-opacity-10">
        <HeaderSection
          logo={attestationFrameLogo}
          ensName={ensName ?? undefined}
          address={address}
        />

        <div className="flex w-full flex-1 truncate">
          <div className="flex h-full w-[60%] flex-col ">
            <TopProjectsSection projects={projects} />

            <TopRoundSection roundName={topRound} />
          </div>
          <StatsSection
            projectsFunded={projectsFunded}
            roundsSupported={roundsSupported}
            checkedOutChains={checkedOutChains}
          />
        </div>
      </div>
    </div>
  );
};
