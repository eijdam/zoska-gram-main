// src/app/api/auth/[...nextauth]/authOptions.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: '/auth/prihlasenie',
    signOut: '/auth/odhlasenie',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in/up, redirect to home
      if (url.includes('/auth/prihlasenie') || url.includes('/auth/registracia')) {
        return '/';
      }
      // After sign out, redirect to public home
      if (url === '/') {
        return baseUrl;
      }
      // Default case
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};