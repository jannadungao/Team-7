/**
 * Name: Layout 
 * Description: Basic page layout for application
 * Sources: 
 * Author(s): Addison Bartelli
 * Date:
 */

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import sql from "./postgres";

export const metadata: Metadata = {
  title: "Personal Assistant App",
  description: "Work in progress",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  //temp for testing

  console.log("Current user devuser is:", process.env.USER)

  /* if (process.env.USER === "addie") {
    const value = await sql`SELECT * FROM "test"`;
    console.log(value[0]?.value instanceof Date, value[0]?.value);
  } */

  return (
    <html lang="en" className="min-h-screen h-svh">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex nofollow"/>
      </head>
      <body className="flex flex-col h-full">
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
