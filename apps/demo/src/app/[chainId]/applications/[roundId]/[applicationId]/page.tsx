import { ApplicationDetails } from "@allo-team/kit";

export default function ApplicationPage({
  params: { chainId = 0, applicationId = "", roundId = "" },
}) {
  return (
    <section className="space-y-8">
      <ApplicationDetails
        id={applicationId}
        chainId={chainId}
        roundId={roundId}
      />
    </section>
  );
}
