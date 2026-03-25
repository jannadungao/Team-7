/**
 * Name: Homepage after login
 * Description:
 * Outputs:
 * Sources:
 * Author(s):
 * Date:
 */

// This needs to be a server component.
// In building features, try to maximize server components and move out client functions as subcomponents.
"use server";

import ServerTest from "./servertest";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ImportGoogleCalendarEvents from "@/components/features/ImportTasks";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <h1 className="flex m-4 text-center p-4 text-3xl font-bold">
        Welcome to MARCO, Below you can Import your existing Google Calendar
        events!
      </h1>
      <ImportGoogleCalendarEvents />
      {/* <h2>
        <ServerTest></ServerTest>
      </h2> */}
    </>
  );
}
