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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: " openid email profile ",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accesTokenExpires = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
