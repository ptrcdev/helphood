import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      role: string;
    } & DefaultSession["user"];
  }
}
