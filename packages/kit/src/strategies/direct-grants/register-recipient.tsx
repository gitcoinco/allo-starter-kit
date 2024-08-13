"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { EthAddressSchema } from "../../schemas";
import { Input } from "../../ui/input";
import { StrategyCreateSchemaFn } from "..";
import { Textarea } from "../../ui/textarea";

export const createSchema: StrategyCreateSchemaFn = (api) =>
  z
    .object({
      __internal__: z.object({
        recipientAddress: EthAddressSchema,
        metadata: z.object({
          name: z.string(),
          description: z.string(),
        }),
      }),
    })
    .transform(async ({ __internal__: { recipientAddress, metadata } }) => {
      const pointer = await api.upload(metadata);

      return encodeAbiParameters(
        parseAbiParameters("address, address, (uint256, string)"),
        [recipientAddress, recipientAddress, [BigInt(1), pointer]],
      );
    });

export function RegisterRecipientForm() {
  const { control, setValue } = useFormContext();
  const { address } = useAccount();
  useEffect(() => {
    // Initialize with connected wallet address
    setValue("strategyData.__internal__.recipientAddress", address);
  }, [address]);
  return (
    <>
      <FormField
        control={control}
        name="strategyData.__internal__.recipientAddress"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>Project address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} />
              </FormControl>
              <FormDescription>
                Payouts will be transferred to this address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name="strategyData.__internal__.metadata.name"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name="strategyData.__internal__.metadata.description"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}
