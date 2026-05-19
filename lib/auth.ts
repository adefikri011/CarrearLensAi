import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { verifyRecaptcha } from "@/lib/recaptcha";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Verify CAPTCHA
        const captchaToken = credentials.captchaToken as string;
        const isCaptchaValid = await verifyRecaptcha(captchaToken);
        
        if (!isCaptchaValid) {
          console.error("Auth Error: reCAPTCHA verification failed for", credentials.email);
          throw new Error("CAPTCHA verification failed");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.error("Auth Error: User not found", credentials.email);
          return null;
        }

        if (!user.password) {
          console.error("Auth Error: User has no password (likely OAuth only)", credentials.email);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          console.error("Auth Error: Invalid password for", credentials.email);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
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
