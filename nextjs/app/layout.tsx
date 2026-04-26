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
import DarkmodeCookieListenerAffectingCSS from "@/components/features/darkmodeCssListener";
import getDarkmodeServer, { getImplicitDarkmodeServer } from "@/utils/isDarkmodeServer";

export const metadata: Metadata = {
  title: "Personal Assistant App",
  description: "Work in progress",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  const explicitColorScheme = await getDarkmodeServer();
  const colorSchemeStringToPass = explicitColorScheme ?? "light";
  const colorSchemeStyle = explicitColorScheme ?? "";

  return (
    <html lang="en" className={`min-h-screen h-svh ${colorSchemeStyle}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex nofollow"/>
      </head>
      <body className="flex flex-col xl:flex-row h-full">
        <DarkmodeCookieListenerAffectingCSS cookieExists={explicitColorScheme !== undefined} />
        <Navbar serverDarkmodeCookie={colorSchemeStringToPass}></Navbar>
        {children}
      </body>
    </html>
  );
}
