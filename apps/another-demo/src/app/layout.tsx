import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@allo/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

import { Provider } from "@allo/ui/provider";

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
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
