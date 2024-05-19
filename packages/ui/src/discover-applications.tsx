"use client";

import { Application, RoundsQuery } from "./api/providers/types";
import { useApplications } from "./hooks/useApplications";
import { BackgroundImage } from "./ui/background-image";
import { Grid, GridProps } from "./ui/grid";

export function DiscoverApplications({
  query,
  ...props
}: GridProps<Application> & { query?: RoundsQuery }) {
  const applications = useApplications(query);
  return <Grid component={ApplicationItem} {...applications} {...props} />;
}

function ApplicationItem({ name, coverImageUrl }: Application) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <BackgroundImage className="bg-gray-100 h-48" src={coverImageUrl} />
      <div className="p-2">
        <h3 className="font-semibold text-xl text-gray-800">{name}</h3>
      </div>
    </div>
  );
}
