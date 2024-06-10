import { ComponentType, ReactNode } from "react";
import { cn } from "../lib/utils";
import { UseQueryResult } from "@tanstack/react-query";
import { ErrorMessage } from "./error-message";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Info } from "lucide-react";

type ColumnValue = 0 | 1 | 2 | 3 | 4;
type Columns = [ColumnValue?, ColumnValue?, ColumnValue?, ColumnValue?];

export type GridProps<T> = {
  columns?: Columns;
  renderItem?: (item: T, Component: ComponentType<T>) => ReactNode;
};

type Props<T> = UseQueryResult<T[], unknown> &
  GridProps<T> & { component: ComponentType<T> };

export function Grid<T>({
  columns = [1, 1, 2, 3],
  data,
  error,
  isPending,
  component: Component,
  renderItem = (item, Component: any) => <Component {...item} />,
}: Props<T>) {
  if (error) return <ErrorMessage error={error} />;
  if (!isPending && !data?.length) return <EmptyState />;

  return (
    <div className={cn("grid gap-4", gridClass(columns))}>
      {data?.map((item) => renderItem(item, Component))}
    </div>
  );
}

function gridClass(columns: Columns): string {
  return columns.reduce<string>(
    (cols, col = 0, i) => cols.concat(columnMap?.[i]?.[col] ?? "") + " ",
    "",
  );
}
const columnMap = [
  {
    0: "",
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  },
  {
    0: "",
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  },
  {
    0: "",
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  },
  {
    0: "",
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
  },
] as const;

function EmptyState() {
  return (
    <Alert>
      <Info className="size-4" />
      <AlertTitle>No results found!</AlertTitle>
      <AlertDescription>
        Couldn&apos;t find any results matching your query
      </AlertDescription>
    </Alert>
  );
}
