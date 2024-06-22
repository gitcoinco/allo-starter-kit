import {
  Button,
  FundRound,
  Markdown,
  RoundNetworkBadge,
  RoundStrategyBadge,
} from "@allo/kit";
import { grantsStackAPI } from "@allo/kit";
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "@allo/kit";
import { notFound } from "next/navigation";
import { Applications } from "./applications";

export default async function ShareRoundPage({
  params: { roundId = "", chainId = "" },
}) {
  const round = await grantsStackAPI.roundById?.(roundId, { chainId });
  if (!round) return notFound();
  return (
    <div>
      <h1 className="text-2xl font-semibold">{round.name}</h1>
      <div className="flex gap-2 pb-1">
        <RoundNetworkBadge chainId={round.chainId} />
        <RoundStrategyBadge strategyName={round.strategyName} />
      </div>
      <Markdown className={"mb-8"}>{round.description}</Markdown>
      <div className="flex justify-center">
        <Drawer>
          <DrawerTrigger>
            <Button>Fund Round</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerFooter>
              <FundRound id={roundId} opts={{ chainId }} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <h3 className="text-lg font-semibold pt-12 pb-4 text-center">
        Top Projects
      </h3>
      <Applications roundId={roundId} chainId={Number(chainId)} />
    </div>
  );
}
