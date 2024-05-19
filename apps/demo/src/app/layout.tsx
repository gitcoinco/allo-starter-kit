import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@allo/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

import { Header } from "./header";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Allo Starter Kit Demo App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="max-w-screen-lg mx-auto py-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
