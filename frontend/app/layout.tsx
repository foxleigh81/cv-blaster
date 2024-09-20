import type { Metadata } from "next";
import localFont from "next/font/local";
import SessionProvider from "@/lib/providers/session-provider";
import { getServerSession } from "next-auth";

import "./globals.css";

import NavMenu from "@/components/local/nav-menu";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
        <div className="grid grid-rows-[auto_1fr_20px] min-h-screen gap-1 font-[family-name:var(--font-geist-sans)]">
          <header className="flex flex-col w-full gap-4 row-start-1 items-start sm:items-start bg-violet-800 text-white p-5">
            <div className="grid grid-cols-2 w-full">
              <h1 className="flex flex-row place-items-center gap-2 text-3xl sm:text-4xl font-bold"><Image src="/cv-blaster-logo.svg" width={90} height={90} alt="CV Blaster logo" />CV Blaster!</h1>
              <NavMenu />
            </div>
            <p className="text-lg text-center sm:text-left">
              Generate a CV easily with a few clicks
            </p>
          </header>
          <main className="flex flex-col p-4">
            {children}
          </main>
        </div>
        </SessionProvider>
      </body>
    </html>
  );
}
