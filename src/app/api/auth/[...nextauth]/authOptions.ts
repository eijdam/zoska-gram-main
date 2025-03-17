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
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/prihlasenie',
    signOut: '/auth/odhlasenie',
    error: '/auth/error',
  },
  events: {
    createUser: async ({ user }) => {
      try {
        // Create profile for new user
        await prisma.profile.create({
          data: {
            userId: user.id,
            bio: "",
            location: "",
            interests: [],
            avatarUrl: user.image || null,
          },
        });
      } catch (error) {
        console.error("Error creating profile:", error);
      }
    },
    signIn: async ({ user, account, profile }) => {
      try {
        // Check if profile exists
        const existingProfile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });

        // Create profile if it doesn't exist
        if (!existingProfile) {
          await prisma.profile.create({
            data: {
              userId: user.id,
              bio: "",
              location: "",
              interests: [],
              avatarUrl: user.image || null,
            },
          });
        }
      } catch (error) {
        console.error("Error handling sign in:", error);
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return true;
      }
      return false;
    },
    async jwt({ token, user, account }) {
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
      // If the url starts with the base url, allow it
      if (url.startsWith(baseUrl)) {
        // If it's an auth page and we're already authenticated, go to home
        if (url.includes('/auth/')) {
          return baseUrl;
        }
        // Otherwise allow the redirect
        return url;
      }
      // Default to base url
      return baseUrl;
    },
  },
};