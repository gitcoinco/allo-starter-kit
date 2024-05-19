"use client";
import { ConnectButton } from "@allo/ui/connect-button";
import Link from "next/link";
export function Header() {
  return (
    <header className="h-16 max-w-screen-lg mx-auto flex items-center justify-between">
      <Link href="/">DemoApp</Link>

      <ConnectButton />
    </header>
  );
}
