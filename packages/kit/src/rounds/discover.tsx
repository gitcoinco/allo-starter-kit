"use client";

import { Round, RoundsQuery } from "../api/types";
import { useRounds } from "../hooks/useRounds";
import { Grid, GridProps } from "../ui/grid";
import { RoundCard } from "./card";

export function DiscoverRounds({
  query,
  ...props
}: GridProps<Round> & { query?: RoundsQuery }) {
  const rounds = useRounds(query!);
  console.log("rounds", rounds.data, rounds.error);
  return <Grid component={RoundCard} {...rounds} {...props} />;
}
