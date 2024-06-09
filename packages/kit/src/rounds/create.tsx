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
import { ImageUpload } from "@/ui/image-upload";
import { useUpload } from "@/hooks/useUpload";

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
  bannerUrl: z.string().optional(),
  strategy: EthAddressSchema,
  token: EthAddressSchema.optional(),
  amount: z.coerce.bigint().optional(),
  chainId: z.number(),
  managers: z.string().transform((v) =>
    v
      .split(",")
      .map((v) => v.trim())
      .map(getAddress),
  ),
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
      amount: 0n,
      name: "",
      description: "",
      strategy: getAddress(strategies[0]!),
      initStrategyData: defaultValues as Address,
      // TODO: should be dropdowns
      chainId: 11155111,
      token: undefined,
      managers: undefined,
    },
  });

  // TODO: Check connected network

  const create = useCreateRound();
  const upload = useUpload();
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          async ({ name, description, ...values }) => {
            console.log("create round", values);
            const metadata = {
              protocol: 1n,
              pointer: await upload.mutateAsync({ name, description }),
            };
            create.mutate(
              { ...values, metadata },
              {
                onSuccess: onCreated,
                onError: (err) => console.log("Create round error", err),
              },
            );
          },
        )}
        className="mx-auto max-w-screen-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Create round</h3>
          <Button
            type="submit"
            isLoading={upload.isPending || create.isPending}
          >
            {upload.isPending
              ? "Uploading metadata..."
              : create.isPending
                ? "Signing transaction..."
                : "Create"}
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
          name="bannerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="gap-2 sm:flex">
          <FormField
            control={form.control}
            name="chainId"
            render={({ field }) => (
              <FormItem className="">
                {/* TODO: Dropdown with network names */}
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
              <FormItem className="flex-1">
                {/* TODO: Dropdown with strategy names */}
                <FormLabel>Strategy address</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="gap-2 sm:flex">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="">
                {/* TODO: Dropdown with token names */}
                <FormLabel>Token</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Initial funding amount</FormLabel>
                <FormControl>
                  <Input {...field} value={Number(field.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="managers"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Round managers</FormLabel>
              <FormControl>
                {/* TODO: Use component with better UX */}
                <Input placeholder="0x...123, 0x...456, 0x...789" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                These will have access to make changes to the round.
              </FormDescription>
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
