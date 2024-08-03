import { UseQueryResult } from "@tanstack/react-query";
import { Application } from "../api/types";
import { useApplications } from "../hooks/useApplications";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { ApplicationStatusBadge } from "./status-badge";
import { BackgroundImage } from "../ui/background-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";

export const columns: ColumnDef<Application>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Project",
    cell: ({ row, ...rest }) => {
      const { name, bannerUrl, description } = row.original;
      return (
        <div
          onClick={() => row.toggleSelected()}
          className="flex flex-1 cursor-pointer gap-4"
        >
          <div className="">
            <BackgroundImage
              className="size-12 rounded bg-gray-800"
              src={bannerUrl}
            />
          </div>

          <div className="">
            <h3 className="line-clamp-1 overflow-hidden text-ellipsis text-sm font-semibold text-gray-800">
              {name}
            </h3>
            <p className="line-clamp-1 text-xs">{description?.slice(0, 144)}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <ApplicationStatusBadge status={row.getValue("status")} />
    ),
  },
];
export function ApplicationsTableWithHook({
  roundId,
  chainId,
  ...props
}: {
  roundId: string;
  chainId: number;
}) {
  return (
    <ApplicationsTable
      {...useApplications({ where: { roundId: { equalTo: roundId } } })}
      {...props}
    />
  );
}

export function ApplicationsTable({
  data = [],
  isPending,
  error,
}: Partial<UseQueryResult<Application[] | undefined, unknown>>) {
  console.log(data, error);
  return (
    <DataTable
      isLoading={isPending}
      columns={columns}
      data={data}
      renderFilter={(table) => {
        return (
          <div className="flex justify-between gap-2">
            <Input
              placeholder="Search..."
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
            />
            <Tabs
              className="mb-2"
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(status) =>
                table.getColumn("status")?.setFilterValue(status)
              }
            >
              <TabsList>
                <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
                <TabsTrigger value="">All</TabsTrigger>
                <TabsContent value="approved"></TabsContent>
              </TabsList>
            </Tabs>
          </div>
        );
      }}
    />
  );
}
