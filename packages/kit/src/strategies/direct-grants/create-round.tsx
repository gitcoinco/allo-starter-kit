"use client";

import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DirectGrantsLiteStrategy } from "@allo-team/allo-v2-sdk/";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { cn } from "../../lib/utils";
import { dateToUint64 } from "../../api/providers/allo2";

export const defaultValues = "0x";
export const schema = z
  .object({
    // Internal state for dates
    __internal__: z.object({ from: z.date(), to: z.date() }),
  })
  // Transform the dates into initStrategyData
  .transform((val) => {
    const { from, to } = val.__internal__;
    return DirectGrantsLiteStrategy.prototype.getInitializeData({
      useRegistryAnchor: false,
      metadataRequired: false,
      registrationStartTime: dateToUint64(from),
      registrationEndTime: dateToUint64(to),
    });
  });

export function CreateRoundForm() {
  const { control } = useFormContext();
  return (
    <>
      <FormField
        control={control}
        name="initStrategyData.__internal__"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>Project Registration</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        `${format(field.value.from, "PPP")}${field.value.to ? ` - ${format(field.value.to, "PPP")}` : ""}`
                      ) : (
                        <span>Pick start and end dates</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When can projects submit their application?
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}
