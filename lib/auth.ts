import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Mock authorization for now
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return { id: "1", name: "SMK Student", email: "user@example.com" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.picture = user.image;
        token.name = user.name;
      }
      
      // If we are missing picture or name in subsequent calls, fetch it once from DB
      // Note: In production, you might want to cache this or only do it on specific triggers
      if (!token.picture || !token.name) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { image: true, name: true }
        });
        if (dbUser) {
          token.picture = dbUser.image;
          token.name = dbUser.name;
        }
      }

      if (trigger === "update") {
        if (session?.image) token.picture = session.image;
        if (session?.name) token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.name && session.user) {
        session.user.name = token.name;
      }
      if (token.picture && session.user) {
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
