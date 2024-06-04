"use client";
import { ConnectButton } from "../../../../packages/kit/src/connect-button";
import Link from "next/link";
export function Header() {
  return (
    <header className="h-16 max-w-screen-lg mx-auto flex items-center justify-between">
      <Link href="/">
        <span className="font-semibold mr-2">Allo Starter Kit</span>

        <span className="text-xs">demo</span>
      </Link>

      <ConnectButton />
    </header>
  );
}
