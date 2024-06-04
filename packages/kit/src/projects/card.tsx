"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Round } from "../api/types";
import { TokenAmount } from "../ui/token-amount";
import { BackgroundImage } from "@/ui/background-image";

export function ProjectCard({
  name,
  description,
  chainId,
  applications,
  matching,
  avatarUrl,
  bannerUrl,
}: Round) {
  return (
    <div className="relative h-64 overflow-hidden rounded-3xl border shadow-xl">
      <BackgroundImage className="h-28 bg-gray-100" src={bannerUrl} />
      {/* <Avatar className="absolute -mt-6 border-2 border-white">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback></AvatarFallback>
      </Avatar> */}
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-800">{name}</h3>
        <p className="text-xs leading-6">{description}</p>
        <div className="">
          <TokenAmount {...matching} />
        </div>
        <div className="">{applications?.length} projects</div>
        <div className="">Network: {chainId}</div>
      </div>
    </div>
  );
}
