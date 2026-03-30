/**
 * Name: Sign-in page for Google authentication
 * Description:
 * Sources: https://next-auth.js.org/providers/google
 * Author(s): Marco Martinez
 * Date: 02/15/26
 */
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignInButton from "./signinbutton";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex grow items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <SignInButton />
      </div>
    </div>
  );
}
