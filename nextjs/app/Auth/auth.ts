/**
 * Name: Route to handle authentication with Google
 * Description:
 * Outputs:
 * Sources: https://next-auth.js.org/providers/google
 * Author(s): Marco Martinez
 * Date: 02/15/26
 */

import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

// TODO GOOGLE AUTH API CALL THIS IS TEMPLATE FROM NEXT AUTH DOCS.
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});

export { handler as GET, handler as POST };
