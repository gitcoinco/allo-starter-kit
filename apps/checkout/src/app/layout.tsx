import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@allo/kit/styles.css";
import "./globals.css";
import { ApiProvider, ConnectButton, Web3Provider } from "@allo/kit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Allo App",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApiProvider>
          <Web3Provider>
            <header className="max-w-screen-md mx-auto  p-2 flex justify-between items-center">
              <div className="size-6 bg-gray-950 rounded-full" />
              <ConnectButton />
            </header>
            <main className="max-w-screen-md mx-auto p-2">
              {children}

              <footer className="py-24"></footer>
            </main>
          </Web3Provider>
        </ApiProvider>
      </body>
    </html>
  );
}
