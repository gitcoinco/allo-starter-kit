"use client";

import { Application } from "../api/types";
import { BackgroundImage } from "../ui/background-image";
import { Card, CardContent } from "../ui/card";

export function ApplicationCard({ name, description, bannerUrl }: Application) {
  return (
    <Card className="relative overflow-hidden rounded-3xl shadow-xl">
      <BackgroundImage className="h-32 bg-gray-800" src={bannerUrl} />

      <CardContent className="space-y-2 p-4">
        <h3 className="truncate text-xl font-semibold text-gray-800">{name}</h3>
        <p className="line-clamp-3 h-[70px] text-xs leading-6">{description}</p>
      </CardContent>
    </Card>
  );
}
