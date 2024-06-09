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
import { useCreateRound, useRoundById } from "@/hooks/useRounds";
import { ApplicationCreated, Round } from "@/api/types";
import { Separator } from "@/ui/separator";
import { useCreateApplication } from "@/hooks/useApplications";

const baseApplicationSchema = z.object({
  roundId: z.bigint(),
  strategyData: z.string(),
  // name: z.string().min(2, {
  //   message: "Name must be at least 2 characters.",
  // }),
  // description: z.string().optional(),
  // project: z.string().optional(),
});

function ApplicationForm({
  defaultValues,
  round,
}: {
  round: Round;
  defaultValues: z.infer<typeof baseApplicationSchema>;
}) {
  const schema = baseApplicationSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      // roundId: "",
      // description: "",
      // project: "",
    },
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

        <div className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project address</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span className="pb-2 text-muted-foreground">or</span>
          <div className="flex items-end gap-4">
            <Button
              variant={"outline"}
              onClick={() => alert("Open Select Project dropdown")}
            >
              Select project
            </Button>
            <span className="pb-2 text-muted-foreground">or</span>
            <Button
              variant={"outline"}
              onClick={() => alert("Open Create Project dialog")}
            >
              Create new project
            </Button>
          </div>
        </div>
        <div>
          <Separator className="my-8" />
        </div>
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

  console.log("round", round);
  if (isPending) return <div>loading round...</div>;
  if (!round) return <div>Round not found</div>;
  return (
    <ApplicationForm
      round={round}
      defaultValues={{
        roundId,
      }}
    />
  );
}
