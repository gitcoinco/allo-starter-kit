import { TokenAmount } from "../ui/token-amount";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Round } from "@/api/types";
import { BackgroundImage } from "../ui/background-image";
import Stock1 from "../assets/banner/stock1.jpg";
import Stock10 from "../assets/banner/stock10.jpg";
import Stock11 from "../assets/banner/stock11.jpg";
import Stock12 from "../assets/banner/stock12.jpg";
import Stock13 from "../assets/banner/stock13.jpg";
import Stock14 from "../assets/banner/stock14.jpg";
import Stock15 from "../assets/banner/stock15.jpg";
import Stock16 from "../assets/banner/stock16.jpg";
import Stock17 from "../assets/banner/stock17.jpg";
import Stock18 from "../assets/banner/stock18.jpg";
import Stock19 from "../assets/banner/stock19.jpg";
import Stock2 from "../assets/banner/stock2.jpg";
import Stock20 from "../assets/banner/stock20.jpg";
import Stock21 from "../assets/banner/stock21.jpg";
import Stock22 from "../assets/banner/stock22.jpg";
import Stock23 from "../assets/banner/stock23.jpg";
import Stock24 from "../assets/banner/stock24.jpg";
import Stock25 from "../assets/banner/stock25.jpg";
import Stock26 from "../assets/banner/stock26.jpg";
import Stock27 from "../assets/banner/stock27.jpg";
import Stock28 from "../assets/banner/stock28.jpg";
import Stock29 from "../assets/banner/stock29.jpg";
import Stock30 from "../assets/banner/stock30.jpg";
import Stock31 from "../assets/banner/stock31.jpg";
import Stock32 from "../assets/banner/stock32.jpg";
import Stock3 from "../assets/banner/stock3.jpg";
import Stock4 from "../assets/banner/stock4.jpg";
import Stock5 from "../assets/banner/stock5.jpg";
import Stock6 from "../assets/banner/stock6.jpg";
import Stock7 from "../assets/banner/stock7.jpg";
import Stock8 from "../assets/banner/stock8.jpg";
import Stock9 from "../assets/banner/stock9.jpg";
import { keccak256, toBytes } from "viem";
import { RoundStrategyBadge } from "./round-strategy-badge";
import { getDaysLeft } from "../utils";

const stockImages = [
  Stock1,
  Stock2,
  Stock3,
  Stock4,
  Stock5,
  Stock6,
  Stock7,
  Stock8,
  Stock9,
  Stock10,
  Stock11,
  Stock12,
  Stock13,
  Stock14,
  Stock15,
  Stock16,
  Stock17,
  Stock18,
  Stock19,
  Stock20,
  Stock21,
  Stock22,
  Stock23,
  Stock24,
  Stock25,
  Stock26,
  Stock27,
  Stock28,
  Stock29,
  Stock30,
  Stock31,
  Stock32,
];

function generateRandomNumber(address: string) {
  const hash = keccak256(toBytes(address));
  const randomByte = parseInt(hash.slice(2, 4), 16);
  const randomNumber = randomByte % stockImages.length;
  return randomNumber;
}

function RoundBanner(props: { roundId: string }) {
  const stockId = generateRandomNumber(props.roundId);
  const stockImage = stockImages[stockId];

  return (
    <div className="overflow-hidden h-32 z-0 rounded-t-[inherit]">
      <div
        className="bg-black blur w-[120%] h-[120%] -mt-4 -ml-4 brightness-[40%] object-cover"
        style={{ backgroundImage: `url(${stockImage.src})` }}
      />
    </div>
  );
}

// TODO: get org name & display network logo
export function RoundCard({
  name,
  chainId,
  applications,
  matching,
  description,
  id,
  strategyName,
  donationsEndTime,
  donationsStartTime,
  applicationsEndTime,
  applicationsStartTime,
}: Round) {
  const roundEndsIn =
    donationsEndTime === null
      ? undefined
      : getDaysLeft(
          Math.round(new Date(donationsEndTime).getTime() / 1000).toString()
        );
  const roundStartsIn =
    donationsStartTime === null
      ? undefined
      : getDaysLeft(
          Math.round(new Date(donationsStartTime).getTime() / 1000).toString()
        );
  const applicationsStartsIn =
    applicationsStartTime === null
      ? undefined
      : getDaysLeft(
          Math.round(
            new Date(applicationsStartTime).getTime() / 1000
          ).toString()
        );
  const applicationsEndsIn =
    applicationsEndTime === null
      ? undefined
      : getDaysLeft(
          Math.round(new Date(applicationsEndTime).getTime() / 1000).toString()
        );

  return (
    <Card>
      <RoundBanner roundId={id} />
      <CardContent className="pb-3">
        <CardTitle className="-mt-9 truncate text-xl sm:text-2xl font-normal mb-6 z-10 relative text-white">
          {name}
        </CardTitle>
        <CardDescription className="mb-2">
          by <Badge variant="secondary">Org name</Badge>
        </CardDescription>

        <p className="line-clamp-4 text-base h-24">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <RoundDaysDetails
            roundStartsIn={roundStartsIn}
            roundEndsIn={roundEndsIn}
            applicationsStartsIn={applicationsStartsIn}
            applicationsEndsIn={applicationsEndsIn}
          />

          {!!strategyName && <RoundStrategyBadge strategyName={strategyName} />}
        </div>
        <Separator className="mt-3" />
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <div className="flex items-center gap-1">
          <Badge variant="secondary">{applications?.length} projects</Badge>
          <Badge variant="secondary">
            <TokenAmount {...matching} />
          </Badge>
        </div>
        <div className="w-7 h-7 rounded-full bg-gray-100" />
      </CardFooter>
    </Card>
  );
}

function getRoundDaysText({
  roundStartsIn,
  roundEndsIn,
}: {
  roundStartsIn?: number;
  roundEndsIn?: number;
}) {
  const dayTerm = getSingularPlural(["day", "days"]);

  if (roundStartsIn !== undefined && roundStartsIn > 0) {
    return `Starts in ${roundStartsIn} ${dayTerm(roundStartsIn)}`;
  }
  if (roundEndsIn === undefined) return "No round end date";
  if (roundEndsIn === 0) return "Ends today";

  return roundEndsIn > 0
    ? `${roundEndsIn} ${dayTerm(roundEndsIn)} left in round`
    : `Ended ${-roundEndsIn} ${dayTerm(-roundEndsIn)} ago`;
}

function getRoundApplicationDaysText({
  applicationsStartsIn,
  applicationsEndsIn,
}: {
  applicationsStartsIn?: number;
  applicationsEndsIn?: number;
}) {
  const dayTerm = getSingularPlural(["day", "days"]);

  // Hide if application date has passed
  if (applicationsEndsIn === undefined || applicationsEndsIn < 0) return "";

  if (applicationsEndsIn === 0) return "Last day to apply";
  if (
    applicationsStartsIn !== undefined &&
    applicationsStartsIn > 0 &&
    applicationsEndsIn > 0
  ) {
    return `Apply in ${applicationsStartsIn} ${dayTerm(applicationsStartsIn)}`;
  }
  return `${applicationsEndsIn} ${dayTerm(applicationsEndsIn)} left to apply`;
}

const RoundDaysDetails = ({
  roundStartsIn,
  roundEndsIn,
  applicationsStartsIn,
  applicationsEndsIn,
}: {
  roundStartsIn: number | undefined;
  roundEndsIn: number | undefined;
  applicationsStartsIn: number | undefined;
  applicationsEndsIn: number | undefined;
}) => {
  const startsOrEndsIn = getRoundDaysText({ roundStartsIn, roundEndsIn });
  const applicationsIn = getRoundApplicationDaysText({
    applicationsStartsIn,
    applicationsEndsIn,
  });
  return (
    <div className="flex-1">
      <div className="text-xs w-full font-mono whitespace-nowrap">
        {applicationsIn}
      </div>
      <div className="text-xs w-full font-mono whitespace-nowrap">
        {startsOrEndsIn}
      </div>
    </div>
  );
};

// If we need something more advanced or to use in another place in codebase, we can pull in a library
const getSingularPlural =
  ([singular = "", plural = ""]) =>
  (num = 0) =>
    num ? (num === 1 ? singular : plural) : plural;
