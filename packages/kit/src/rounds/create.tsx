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
import { Address, getAddress, isAddress } from "viem";
import { RoundCreated } from "@/api/types";

export const EthAddressSchema = z.custom<Address>(
  (val) => isAddress(val as Address),
  "Invalid address",
);

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Round name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  strategyAddress: EthAddressSchema,
  chainId: z.number(),
});

const contractSchemas = {
  directGrants: z.object({
    initStrategyData: z.object({
      registrationStartTime: z.string(),
      registrationEndTime: z.string(),
    }),
  }),
};
function DirectGrantsForm() {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name="initStrategyData.registrationStartTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration starts</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="initStrategyData.registrationEndTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration ends</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export function CreateRound({
  strategies,
  onCreated,
}: {
  strategies: Address[];
  onCreated: (round: RoundCreated) => void;
}) {
  const schema = formSchema.merge(contractSchemas.directGrants);
  const create = useCreateRound();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      chainId: 11155111,
      strategyAddress: getAddress(strategies[0]!),

      initStrategyData: {
        registrationStartTime: new Date().toISOString(),
        registrationEndTime: new Date(
          Date.now() + 1000 * 3600 * 24 * 30,
        ).toISOString(),
      },
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log(values);
          create.mutate(values, { onSuccess: onCreated });
        })}
        className="space-y-4"
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
          name="strategyAddress"
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
        <DirectGrantsForm />
      </form>
    </Form>
  );
}
