// This needs to be a server component.
// In building features, try to maximize server components and move out client functions as subcomponents.
"use server";

import ServerTest from "./servertest";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <h1>{/* One two three four, I declare a thumb war. */}</h1>

      {/* <h2>
        <ServerTest></ServerTest>
      </h2> */}
    </>
  );
}
