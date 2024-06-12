"use client";
import { Button, Form, FormField, useForm, useFormContext } from "@allo/kit";
import { ApplicationApprovalItem } from "@allo/kit";
import { useApplications } from "@/hooks/useApplications";
import { ReactNode, useMemo } from "react";
import { Application } from "@/api/types";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { useRoundById } from "@/hooks/useRounds";
import { getStrategyType, useStrategyType } from "@/strategies";

export function ApplicationReviewTable({
  roundId,
  chainId,
}: {
  roundId: string;
  chainId: number;
}) {
  const { data: round } = useRoundById(roundId, { chainId });
  const { data: applications } = useApplications({
    where: { roundId: { equals: roundId } },
  });

  const form = useForm();

  const strategyType = useStrategyType(round);
  console.log(strategyType);

  const applicationByStatus = useMemo(() => {
    const initialState = {
      APPROVED: [],
      PENDING: [],
      REJECTED: [],
    } as Record<Application["status"], Application[]>;
    return (applications ?? []).reduce(
      (acc, x) => ({
        ...acc,
        [x.status]: (acc[x.status] || []).concat(x),
      }),
      initialState,
    );
  }, [applications]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((selected) => {
          console.log("selected", selected);
        })}
      >
        <Tabs
          defaultValue="pending"
          className=""
          onValueChange={() => form.setValue("selected", [])}
        >
          <TabsList>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="-mt-12 flex justify-end gap-4">
              <SelectAllButton applications={applicationByStatus.PENDING} />
              <ApproveButton label="Approve" />
            </div>
            <ApplicationsList
              action={<Button variant="outline">Review</Button>}
              applications={Object.values(applicationByStatus.PENDING)}
            />
          </TabsContent>
          <TabsContent value="approved">
            <div className="-mt-12 flex justify-end gap-4">
              <SelectAllButton applications={applicationByStatus.APPROVED} />
              <ApproveButton label="Reject" />
            </div>
            <ApplicationsList
              action={<Button variant="outline">Reject</Button>}
              applications={Object.values(applicationByStatus.APPROVED)}
            />
          </TabsContent>
          <TabsContent value="rejected">
            <div className="-mt-12 flex justify-end gap-4">
              <SelectAllButton applications={applicationByStatus.REJECTED} />
              <ApproveButton label="Approve" />
            </div>
            <ApplicationsList
              action={<Button variant="outline">Approve</Button>}
              applications={Object.values(applicationByStatus.REJECTED)}
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

function ApproveButton({ label = "" }) {
  const selected = useFormContext().watch("selected")?.length ?? 0;
  return (
    <Button type="submit" icon={Check} disabled={!selected}>
      {label} {selected} applications
    </Button>
  );
}

function SelectAllButton({
  applications = [],
}: {
  applications: Application[];
}) {
  const form = useFormContext();
  const selected = form.watch("selected");
  const isAllSelected =
    selected?.length > 0 && selected?.length === applications?.length;
  return (
    <Button
      disabled={!applications.length}
      type="button"
      variant={"outline"}
      onClick={() => {
        const selectAll = isAllSelected ? [] : applications.map(({ id }) => id);
        form.setValue("selected", selectAll);
      }}
    >
      {isAllSelected ? "Deselect all" : "Select all"}
    </Button>
  );
}

function ApplicationsList({
  action,
  applications = [],
}: {
  action: ReactNode;
  applications: Application[];
}) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="selected"
      render={() => (
        <>
          {applications.map((application) => (
            <FormField
              key={application.id}
              control={control}
              name="selected"
              render={({ field }) => (
                <ApplicationApprovalItem
                  key={application.id}
                  action={action}
                  checked={field.value?.includes(application.id)}
                  onCheckedChange={(checked) =>
                    checked
                      ? field.onChange([...(field.value ?? []), application.id])
                      : field.onChange(
                          field.value?.filter(
                            (value: string) => value !== application.id,
                          ),
                        )
                  }
                  {...application}
                />
              )}
            />
          ))}
        </>
      )}
    />
  );
}
