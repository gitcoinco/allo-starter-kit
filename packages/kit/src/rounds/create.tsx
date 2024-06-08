"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { useCreateRound } from "@/hooks/useRounds";
import { Address, getAddress, isAddress } from "viem";
import { RoundCreated } from "@/api/types";
import {
  schema as directGrantsSchema,
  defaultValues as directGrantsDefaultValues,
  DirectGrantsForm,
} from "./strategies/direct-grants";
import { createElement } from "react";

// TODO: move this to /schemas.ts
export const EthAddressSchema = z.custom<Address>(
  (val) => isAddress(val as Address),
  "Invalid address",
);

const strategyAddons = {
  directGrants: {
    schema: directGrantsSchema,
    defaultValues: directGrantsDefaultValues,
    component: DirectGrantsForm,
  },
};

const baseRoundSchema = z.object({
  name: z.string().min(2, {
    message: "Round name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  strategy: EthAddressSchema,
  token: EthAddressSchema.optional(),
  chainId: z.number(),
});

export function CreateRound({
  strategies,
  onCreated,
}: {
  strategies: Address[];
  onCreated: (round: RoundCreated) => void;
}) {
  // TODO: Make this dynamic when user selects one of the schemas in the dropdown
  const strategy = "directGrants";
  const {
    schema: schemaAddon,
    component,
    defaultValues,
  } = strategyAddons[strategy];
  // Merge strategy schema into base round schema
  const schema = baseRoundSchema.merge(
    z.object({ initStrategyData: schemaAddon }),
  );
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      strategy: getAddress(strategies[0]!),
      initStrategyData: defaultValues as Address,
      // TODO: should be dropdowns
      chainId: 11155111,
      token: undefined,
    },
  });

  const create = useCreateRound();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log("create round", values);
          create.mutate(values, { onSuccess: onCreated });
        })}
        className="mx-auto max-w-screen-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Create round</h3>
          <Button type="submit" isLoading={create.isPending}>
            Create Round
          </Button>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Round name</FormLabel>
              <FormControl>
                <Input placeholder="Round name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chainId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strategy address</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Round description</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
                  placeholder="Round description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>Markdown is supported</FormDescription>
            </FormItem>
          )}
        />
        {/* Render Strategy-specific form elements */}
        {createElement(component)}
      </form>
    </Form>
  );
}
