// This needs to be a server component.
// In building features, try to maximize server components and move out client functions as subcomponents.
"use server";

import ServerTest from "./servertest";

export default async function Home() {
  return (
    <>
      <h1>
        One two three four, I declare a thumb war.
      </h1>

      <h2>
        <ServerTest></ServerTest>
      </h2>
    </>
  );
}
