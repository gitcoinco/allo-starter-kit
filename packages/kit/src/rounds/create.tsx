"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
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
import { Address, getAddress } from "viem";
import { RoundCreated } from "@/api/types";

import { PropsWithChildren, createElement } from "react";
import { ImageUpload } from "@/ui/image-upload";
import { useUpload } from "@/hooks/useUpload";
import { EthAddressSchema } from "@/schemas";
import { getStrategyAddon } from "@/strategies";
import { EnsureCorrectNetwork } from "@/ui/correct-network";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { supportedChains } from "..";

const baseRoundSchema = z.object({
  name: z.string().min(2, {
    message: "Round name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  bannerUrl: z.string().optional(),
  strategy: EthAddressSchema,
  token: EthAddressSchema.optional(),
  amount: z.coerce.bigint().optional(),
  chainId: z.coerce.number(),
  managers: z
    .string()
    .optional()
    .transform((v) =>
      v
        ?.split(",")
        .map((v) => v.trim())
        .map(getAddress),
    ),
});

function CreateButton({
  isLoading,
  children,
}: PropsWithChildren<{ isLoading: boolean }>) {
  const chainId = Number(useFormContext().watch("chainId"));

  return (
    <EnsureCorrectNetwork chainId={chainId}>
      <Button type="submit" isLoading={isLoading}>
        {children}
      </Button>
    </EnsureCorrectNetwork>
  );
}
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
  } = getStrategyAddon(strategy, "createRound");

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
          <CreateButton isLoading={upload.isPending || create.isPending}>
            {upload.isPending
              ? "Uploading metadata..."
              : create.isPending
                ? "Signing transaction..."
                : "Create"}
          </CreateButton>
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
              <FormItem className="min-w-48">
                <FormLabel>Network</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select a network" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {supportedChains.map((network) => (
                      <SelectItem
                        key={network.id}
                        value={String(network.id)}
                        className="capitalize"
                      >
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
