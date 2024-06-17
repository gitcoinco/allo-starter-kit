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
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useCreateRound } from "../hooks/useRounds";
import { Address, getAddress, zeroAddress } from "viem";
import { RoundCreated } from "../api/types";

import { PropsWithChildren, createElement, useMemo } from "react";
import { ImageUpload } from "../ui/image-upload";
import { useUpload } from "../hooks/useUpload";
import { EthAddressSchema } from "../schemas";
import { getStrategyAddon, getStrategyTypeFromAddress } from "../strategies";
import { EnsureCorrectNetwork } from "../ui/correct-network";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { supportedChains } from "..";
import { useNetwork } from "../hooks/useNetwork";

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
  onCreated?: (round: RoundCreated) => void;
}) {
  const strategy = "directGrants";
  // TODO: Make this dynamic when user selects one of the schemas in the dropdown
  const addon = getStrategyAddon(strategy, "createRound");
  // Merge strategy schema into base round schema
  const schema = addon
    ? baseRoundSchema.merge(z.object({ initStrategyData: addon.schema }))
    : baseRoundSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: BigInt(0),
      name: "",
      description: "",
      strategy: strategies?.length ? getAddress(strategies[0]!) : undefined,
      chainId: 11155111,
      token: zeroAddress,
      managers: undefined,
      ...(addon?.defaultValues
        ? { initStrategyData: addon?.defaultValues as Address }
        : undefined),
    },
  });

  const create = useCreateRound();
  const upload = useUpload();

  const network = useNetwork();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          async ({ name, description, ...values }) => {
            console.log("create round", values);
            const pointer = await upload.mutateAsync({
              // TODO: This is GrantsStack-specific
              // Do we want to move this to the provider to build the metadata shape?
              // Could also use a transformer - api.transformers.roundMetadata({ name, description })
              round: {
                name,
                description,
                roundType: "public",
                quadraticFundingConfig: {
                  matchingFundsAvailable: 0,
                },
              },
            });
            const metadata = {
              protocol: BigInt(1),
              pointer: pointer as string,
            };

            console.log(metadata);
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
                    {supportedChains?.map((network) => (
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
                <FormLabel>Strategy</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {strategies?.map((strategy) => (
                      <StrategySelectItem key={strategy} strategy={strategy} />
                    ))}
                  </SelectContent>
                </Select>
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
              <FormItem className="flex-1">
                {/* TODO: Dropdown with token names */}
                <FormLabel>Token</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(network?.tokens ?? []).map((token) => (
                      <SelectItem key={token.address} value={token.address}>
                        {token.code}
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
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Initial funding amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    type="number"
                    value={Number(field.value)}
                  />
                </FormControl>
                <FormDescription>
                  TODO: handle decimals from selected token
                </FormDescription>
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
        {addon?.component && createElement(addon.component)}
      </form>
    </Form>
  );
}

function StrategySelectItem({ strategy }: { strategy: Address }) {
  const chainId = Number(useFormContext().watch("chainId"));
  const strategyName = useMemo(
    () => getStrategyTypeFromAddress(strategy, chainId) || strategy,
    [chainId, strategy],
  );
  return <SelectItem value={strategy}>{strategyName}</SelectItem>;
}
