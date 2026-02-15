import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Personal Assistant App",
  description: "Work in progress",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
