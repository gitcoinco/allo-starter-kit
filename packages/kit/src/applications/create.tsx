"use client";

import { createElement } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useRoundById } from "../hooks/useRounds";
import { ApplicationCreated, Round } from "../api/types";
import { useCreateApplication } from "../hooks/useApplications";
import { useStrategyAddon } from "../strategies";

const baseApplicationSchema = z.object({
  roundId: z.coerce.bigint(),
});

function ApplicationForm({
  defaultValues,
  round,
  onCreated,
}: {
  round: Round;
  defaultValues: z.infer<typeof baseApplicationSchema>;
  onCreated?: (application: ApplicationCreated) => void;
}) {
  const addon = useStrategyAddon("registerRecipient", round);
  // Merge strategy schema into base round schema
  const schema = addon
    ? baseApplicationSchema.merge(z.object({ strategyData: addon.schema }))
    : baseApplicationSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const create = useCreateApplication();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log("create application", values);
          create.mutate(values, { onSuccess: onCreated });
        })}
        className="mx-auto max-w-screen-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">
            Create application for {round.name}
          </h3>
          <Button type="submit" isLoading={create.isPending}>
            Create
          </Button>
        </div>
        {/* Render Strategy-specific form elements */}
        {addon?.component && createElement(addon.component)}
      </form>
    </Form>
  );
}

export function CreateApplication({
  chainId,
  roundId,
  onCreated,
}: {
  chainId: string;
  roundId: string;
  onCreated?: (application: ApplicationCreated) => void;
}) {
  const { data: round, isPending } = useRoundById(roundId, { chainId });

  if (isPending) return <div>loading round...</div>;
  if (!round) return <div>Round not found</div>;

  return (
    <ApplicationForm
      round={round}
      onCreated={onCreated}
      defaultValues={{
        roundId: BigInt(roundId),
      }}
    />
  );
}
