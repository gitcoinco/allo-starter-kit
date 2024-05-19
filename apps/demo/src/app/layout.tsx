import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@allo/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

import { Provider } from "@allo/ui/provider";
import { Header } from "./header";
import { ApiProvider } from "../../../../packages/ui/src/api/providers/provider";

export const metadata: Metadata = {
  title: "Allo Demo App",
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
        <Provider>
          <ApiProvider provider="grants-stack">
            <Header />
            <main className="max-w-screen-lg mx-auto py-16">{children}</main>
          </ApiProvider>
        </Provider>
      </body>
    </html>
  );
}
