/**
 * Name: Route to handle authentication with Google
 * Description:
 * Outputs:
 * Sources: https://next-auth.js.org/providers/google
 * Author(s): Marco Martinez
 * Date: 02/15/26
 */

import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import sql from "../../postgres";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.readonly",
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
    async signIn({ user, account }) {
      // Create user in database if they don't exist
      try {
        const existingUser = await sql<any[]>`
          SELECT * FROM users WHERE google_user_id = ${account?.providerAccountId}
        `;
        
        if (existingUser.length === 0) {
          await sql`
            INSERT INTO users (google_user_id, email, name, created_at, updated_at)
            VALUES (${account?.providerAccountId}, ${user?.email}, ${user?.name}, NOW(), NOW())
          `;
        }
      } catch (error) {
        console.error("Error creating user:", error);
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        // Store Google's subject identifier (unique user ID) from account
        token.googleUserId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error;
      // Pass Google user ID to session
      (session as any).googleUserId = token.googleUserId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// /**
//  * Name: Route to handle authentication with Google
//  * Description:
//  * Outputs:
//  * Sources: https://next-auth.js.org/providers/google
//  * Author(s): Marco Martinez
//  * Date: 02/15/26
//  */

// import NextAuth, { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           scope:
//             "openid email profile https://www.googleapis.com/auth/calendar.readonly",
//           access_type: "offline",
//           prompt: "consent",
//         },
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/sign-in",
//   },
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//         token.accessTokenExpires = account.expires_at;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken as string;
//       session.error = token.error;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
