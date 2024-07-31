"use client";

import { Application } from "../api/types";
import { BackgroundImage } from "../ui/background-image";
import { Checkbox } from "../ui/checkbox";
import { ReactNode } from "react";
import { ApplicationStatusBadge } from "./status-badge";

export function ApplicationApprovalItem({
  id,
  project: {
    metadata: { title, description, bannerImg },
  },
  status,
  action,
  checked,
  onCheckedChange,
}: Application & {
  checked: boolean;
  action?: ReactNode;
  onCheckedChange: (bool: boolean) => void;
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
            src={bannerImg}
          />
        </div>

        <div className="">
          <h3 className="line-clamp-1 overflow-hidden text-ellipsis text-sm font-semibold text-gray-800">
            {title}
          </h3>
          <p className="line-clamp-1 text-xs">{description?.slice(0, 144)}</p>
        </div>
      </label>
      <div className="flex items-center gap-2">
        <div>
          <ApplicationStatusBadge status={status} />
        </div>
        {action}
      </div>
    </div>
  );
}
