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

  console.log(process.env.USER)

  if (process.env.USER === "addie") {
    const value = await sql`SELECT * FROM "test"`;
    console.log(value[0]?.value instanceof Date, value[0]?.value);
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="min-h-full h-full flex flex-col">
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
