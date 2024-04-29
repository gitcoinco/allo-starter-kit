import { RoundDetails } from "@allo/ui/round-details";
import { DiscoverProjects } from "@allo/ui/discover-projects";

export default function Round({ params: { roundId = "" } }) {
  return (
    <div>
      <RoundDetails id={roundId} />;
      <DiscoverProjects roundId={roundId} />
    </div>
  );
}
