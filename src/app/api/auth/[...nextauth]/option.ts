import { connectToDB } from "@/lib/db";
// @ts-ignore
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) return null;

        await connectToDB();

        const normalizedEmail = email.trim().toLowerCase();
        const escapeRe = (s: string) =>
          s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const user = await User.findOne({
          email: new RegExp(`^${escapeRe(normalizedEmail)}$`, "i"),
        } as any);

        if (!user) return null;

        if (typeof user.password !== "string" || user.password.length < 10) {
          return null;
        }

        let isPasswordCorrect = false;
        try {
          isPasswordCorrect = await bcrypt.compare(password, user.password);
        } catch {
          return null;
        }

        if (!isPasswordCorrect) return null;

        if (user.email !== normalizedEmail) {
          await User.updateOne(
            { _id: user._id },
            { $set: { email: normalizedEmail } }
          );
        }

        return {
          id: user._id.toString(),
          email: normalizedEmail,
          name: user.name,
          image: user.image ?? undefined,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      try {
        await connectToDB();

        if (!user?.email) return false;

        const normalizedEmail = user.email.toLowerCase();

        const existingUser = await User.findOne({
          email: normalizedEmail,
        } as any);

        if (!existingUser) {
          await User.create({
            email: normalizedEmail,
            name: user.name,
            image: user.image,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = (token.picture as string) ?? undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  // @ts-expect-error
  trustHost: true,
};