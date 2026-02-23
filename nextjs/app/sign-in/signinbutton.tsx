/**
 * Name: temporary simple sign-in button for Google authentication
 * Description:
 * Outputs:
 * Sources: https://next-auth.js.org/providers/google
 * Author(s): Marco Martinez
 * Date: 02/15/26
 */
"use client";
import { signIn } from "next-auth/react";

export default function signInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="bg-gray-500 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with Google
    </button>
  );
}
