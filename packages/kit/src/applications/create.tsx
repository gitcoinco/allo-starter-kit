"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/ui/form";
import { Button } from "@/ui/button";

import { useRoundById } from "@/hooks/useRounds";
import { ApplicationCreated, Round } from "@/api/types";

import { useCreateApplication } from "@/hooks/useApplications";
import { getStrategyAddon } from "@/strategies";
import { createElement } from "react";

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
  onCreated: (application: ApplicationCreated) => void;
}) {
  const {
    schema: schemaAddon,
    component,
    defaultValues: registerRecipientDefaultValues,
  } = getStrategyAddon("directGrants", "registerRecipient");

  // Merge strategy schema into base round schema
  const schema = baseApplicationSchema.merge(
    z.object({ strategyData: schemaAddon }),
  );

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
        {createElement(component)}
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
  onCreated: (application: ApplicationCreated) => void;
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
