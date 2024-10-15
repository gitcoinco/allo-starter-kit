import { MintingAttestationFrame, MintingAttestationFrameProps } from "./MintingAttestationFrame";

export type HiddenMintingAttestationFrameProps = MintingAttestationFrameProps & {
  imagesBase64: string[] | undefined;
  hidden?: boolean;
};

export const HiddenMintingAttestationFrame = (props: HiddenMintingAttestationFrameProps) => {
  const { imagesBase64, hidden = true, projects, topRound, ...partialFrameProps } = props;
  const projectsWithImage = projects.map((project, i) => ({
    ...project,
    image: imagesBase64 ? imagesBase64[i] : "",
  }));

  return (
    <div
      id="hidden-attestation-frame"
      style={{
        ...(hidden && {
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "0",
          height: "0",
        }),
        overflow: "hidden",
      }}
    >
      <MintingAttestationFrame
        {...partialFrameProps}
        projects={projectsWithImage}
        topRound={topRound ?? ""}
      />
    </div>
  );
};
