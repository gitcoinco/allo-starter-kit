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

export const schema = z
  .object({
    __internal__: z.object({
      recipientAddress: EthAddressSchema,
    }),
  })
  // Transform into strategyData
  .transform((val) => {
    const { recipientAddress } = val.__internal__;

    // TODO: add application metadata
    const metadata = { protocol: BigInt(1), pointer: "" };
    return encodeAbiParameters(
      parseAbiParameters("address, address, (uint256, string)"),
      [
        recipientAddress,
        recipientAddress,
        [metadata.protocol, metadata.pointer],
      ],
    );
  });

export function RegisterRecipientForm() {
  const { control, setValue } = useFormContext();
  const { address } = useAccount();
  useEffect(() => {
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
    </>
  );
}
