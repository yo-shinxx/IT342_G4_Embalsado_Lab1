// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authenticateWithGoogle } from "@/lib/api/auth";
import type { GoogleAuthResponse } from "@/types/auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check institutional email
      if (user.email && !user.email.endsWith('@cit.edu')) {
        return false; // In v5, return false instead of a URL
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // when user signs in, authenticate with backend
      if (account && user) {
        try {
          // send the OAuth token to backend
          const backendResponse: GoogleAuthResponse = await authenticateWithGoogle(account.access_token!);
          
          // store the backend data in the JWT
          token.backendToken = backendResponse.token;
          token.userId = backendResponse.userId.toString();
          token.email = backendResponse.email;
          token.firstName = backendResponse.firstName;
          token.lastName = backendResponse.lastName;
          token.role = backendResponse.role;
          token.avatar = user.image || null;
        } catch (error) {
          console.error('Backend authentication failed:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add backend data to the session
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.backendToken = token.backendToken as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as { roleId: number; roleName: string };
        session.user.avatar = token.avatar as string | null;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
});