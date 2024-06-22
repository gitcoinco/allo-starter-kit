"use client";
import { ReactNode, useMemo } from "react";
import { Check } from "lucide-react";
import { Button, Form, FormField, useForm, useFormContext } from "@allo/kit";
import { ApplicationApprovalItem } from "../applications/approval-item";
import { useApplications } from "../hooks/useApplications";
import { Application } from "../api/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRoundById } from "../hooks/useRounds";
import { useStrategyAddon, useStrategyType } from "../strategies";
import { EmptyState } from "../ui/empty-state";

export function ApplicationReviewTable({
  roundId,
  chainId,
  initialTab = "PENDING",
}: {
  roundId: string;
  chainId: number;
  initialTab?: Application["status"];
}) {
  const { data: round } = useRoundById(roundId, { chainId });
  const { data: applications, isPending } = useApplications({
    where: { roundId: { equals: roundId } },
  });

  const form = useForm();

  const strategyAddon = useStrategyAddon("reviewRecipients", round);
  console.log("strategyAddon", strategyAddon);
  const applicationByStatus = useMemo(() => {
    const initialState = {
      APPROVED: [],
      PENDING: [],
      REJECTED: [],
      CANCELLED: [],
      IN_REVIEW: [],
    } as Record<Application["status"], Application[]>;
    return (applications ?? [])?.reduce(
      (acc, x) => ({
        ...acc,
        [x.status]: (acc[x.status] || []).concat(x),
      }),
      initialState,
    );
  }, [applications]);

  const isLoading = strategyAddon?.call?.isPending;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ selected }) => {
          strategyAddon?.call?.mutate([
            applications,
            selected,
            round?.strategy,
            BigInt(2), // TODO: map to approved, pending, rejected
          ]);
        })}
      >
        <Tabs
          defaultValue={initialTab}
          className=""
          onValueChange={() => form.setValue("selected", [])}
        >
          <TabsList>
            <TabsTrigger value="APPROVED">Approved</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="PENDING">
            <div className="-mt-12 flex justify-end gap-4">
              <SelectAllButton applications={applicationByStatus.PENDING} />
              <ApproveButton label="Approve" isLoading={isLoading} />
            </div>
            <ApplicationsList
              isLoading={isPending}
              action={<Button variant="outline">Review</Button>}
              applications={Object.values(applicationByStatus.PENDING)}
            />
          </TabsContent>
          <TabsContent value="APPROVED">
            <div className="-mt-12 flex justify-end gap-4">
              <SelectAllButton applications={applicationByStatus.APPROVED} />
              <ApproveButton label="Reject" isLoading={isLoading} />
            </div>
            <ApplicationsList
              isLoading={isPending}
              action={<Button variant="outline">Reject</Button>}
              applications={Object.values(applicationByStatus.APPROVED)}
            />
          </TabsContent>
          <TabsContent value="REJECTED">
            <div className="-mt-12 flex justify-end gap-4">
              <SelectAllButton applications={applicationByStatus.REJECTED} />
              <ApproveButton label="Approve" isLoading={isLoading} />
            </div>
            <ApplicationsList
              isLoading={isPending}
              action={<Button variant="outline">Approve</Button>}
              applications={Object.values(applicationByStatus.REJECTED)}
            />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

function ApproveButton({ label = "", isLoading = false }) {
  const selected = useFormContext().watch("selected")?.length ?? 0;
  return (
    <Button
      type="submit"
      icon={Check}
      isLoading={isLoading}
      disabled={!selected || isLoading}
    >
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
  isLoading,
}: {
  action: ReactNode;
  applications: Application[];
  isLoading?: boolean;
}) {
  const { control } = useFormContext();
  return (
    <div className="mt-1">
      <FormField
        control={control}
        name="selected"
        render={() => (
          <>
            {!isLoading && !applications?.length && <EmptyState />}
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
                        ? field.onChange([
                            ...(field.value ?? []),
                            application.id,
                          ])
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
    </div>
  );
}
