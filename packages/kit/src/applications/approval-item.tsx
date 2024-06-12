"use client";

import { Application } from "../api/types";
import { BackgroundImage } from "@/ui/background-image";
import { Badge } from "@/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ReactNode } from "react";

export function ApplicationApprovalItem({
  id,
  name,
  description,
  bannerUrl,
  status,
  action,
  checked,
  onCheckedChange,
}: Application & {
  checked: boolean;
  action?: ReactNode;
  onCheckedChange: (bool: CheckedState) => void;
}) {
  return (
    <div className="flex gap-4 rounded-lg px-2 py-4 hover:bg-moss-50/20">
      <div className="flex items-center">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} id={id} />
      </div>
      <label htmlFor={id} className="flex flex-1 cursor-pointer gap-4">
        <div className="">
          <BackgroundImage
            className="size-12 rounded bg-gray-800"
            src={bannerUrl}
          />
        </div>

        <div className="">
          <h3 className="line-clamp-1 overflow-hidden text-ellipsis text-sm font-semibold text-gray-800">
            {name}
          </h3>
          <p className="line-clamp-1 text-xs">{description?.slice(0, 144)}</p>
        </div>
      </label>
      <div className="flex items-center gap-2">
        <div>
          <Badge variant={statusMap[status]} className={cn("capitalize")}>
            {status.toLowerCase()}
          </Badge>
        </div>
        {action}
      </div>
    </div>
  );
}

const statusMap = {
  APPROVED: "green",
  PENDING: "yellow",
  REJECTED: "red",
} as const;
