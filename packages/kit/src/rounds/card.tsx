import { useMemo } from "react";
import { isAfter, formatDistanceToNow } from "date-fns";
import { Round } from "../api/types";
import { TokenAmount } from "../ui/token-amount";
import { BackgroundImage } from "../ui/background-image";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { cn, supportedChains } from "..";
import { RoundStrategyBadge } from "./strategy-badge";

const toNow = (date?: string) =>
  date ? formatDistanceToNow(date, { addSuffix: true }) : undefined;

const getRoundTime = (round: Round): string => {
  const now = new Date();

  if (isAfter(round.applicationsStartTime!, now))
    return `Starts ${toNow(round.applicationsStartTime)}`;
  if (isAfter(now, round.donationsEndTime!))
    return `Ended ${toNow(round.donationsEndTime)}`;
  if (isAfter(round.donationsEndTime!, now))
    return `Ends ${toNow(round.donationsEndTime)}`;
  return "";
};

const getNetwork = (chainId: number) =>
  supportedChains?.find((chain) => chain.id === chainId);

export type RoundCard = Round & {
  // components?: RoundComponent[];
  isLoading?: boolean;
};

export function RoundCard({ isLoading, ...round }: RoundCard) {
  const {
    chainId,
    applications,
    roundMetadata: { name, eligibility: { description } = {} } = {},
    matchAmount,
    matchTokenAddress,
    strategyName,
  } = round;
  const network = useMemo(() => getNetwork(chainId), [chainId]);
  return (
    <Card
      className={cn("relative overflow-hidden rounded-3xl shadow-xl", {
        ["animate-pulse"]: isLoading,
      })}
    >
      <div className="">
        <BackgroundImage className="h-32 bg-gray-800" src={""} />
        <h3 className="-mt-8 truncate pl-1 text-2xl font-medium text-gray-100">
          {name}
        </h3>
      </div>
      <CardContent className="space-y-2 p-4">
        <p className="line-clamp-4 h-24 text-base leading-6">{description}</p>
        <div className="flex flex-1 items-center justify-between text-xs">
          <div className="w-1/2 truncate font-mono">{getRoundTime(round)}</div>
          <div className="flex w-1/2 justify-end">
            <RoundStrategyBadge strategyName={strategyName} />
          </div>
        </div>
        <Separator className="my-2" />
        <div className="">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex gap-2">
                {applications && (
                  <Badge variant={"secondary"}>
                    {applications?.length} projects
                  </Badge>
                )}
                {matchAmount ? (
                  <Badge variant={"secondary"}>
                    <TokenAmount
                      amount={matchAmount}
                      token={matchTokenAddress}
                    />
                  </Badge>
                ) : null}
              </div>
            </div>
            <Avatar className="size-8">
              <div
                className="size-8"
                dangerouslySetInnerHTML={{ __html: network?.icon! }}
              />
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
