"use client";

import { Application, ApplicationsQuery } from "../api/types";
import { useApplications } from "../hooks/useApplications";
import { Grid, GridProps } from "../ui/grid";
import { ApplicationCard } from "./card";

export function DiscoverApplications({
  query,
  ...props
}: GridProps<Application> & { query?: ApplicationsQuery }) {
  const applications = useApplications(query!);
  return <Grid component={ApplicationCard} {...applications} {...props} />;
}
