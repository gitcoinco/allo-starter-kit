"use client";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Application } from "../api/types";
import { BackgroundImage } from "../ui/background-image";
import { Card, CardContent } from "../ui/card";

export function ApplicationCard({
  name,
  description,
  avatarUrl,
  bannerUrl,
}: Application) {
  return (
    <Card className="relative overflow-hidden rounded-3xl shadow-xl">
      <div className="">
        <BackgroundImage className="h-32 bg-gray-800" src={bannerUrl} />
      </div>
      {/* <div className="-mt-12 ml-2 inline-flex rounded-full bg-white p-0.5">
        {avatarUrl && (
          <Avatar className="size-8">
            <AvatarImage src={avatarUrl} alt={name} />
          </Avatar>
        )}
      </div> */}
      <CardContent className="space-y-2 p-4">
        <h3 className="truncate text-xl font-semibold text-gray-800">{name}</h3>
        <p className="line-clamp-3 h-[72px] text-xs leading-6">{description}</p>
      </CardContent>
    </Card>
  );
}
