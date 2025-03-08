import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import type { JWT } from "next-auth/jwt";

// Define the interface for the token with id as optional
interface AuthToken extends JWT {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  userId?: string | null;
  role?: string | null;
}

// Define the interface for the user
interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  userId?: string | null;
  role?: string | null;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("hoodhelp");

        const user = await db.collection("users").findOne({
          email: credentials?.email,
        });

        if (!user) {
          throw new Error("No user found with the provided email");
        }

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return { 
          id: user._id.toString(), 
          email: user.email,    
          name: user.name,
          image: user.image,
          userId: user.userId,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy
  },
  callbacks: {
    async jwt({ token, user }: { token: AuthToken; user?: AuthUser }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.userId = user.userId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: AuthToken }) {
      if (token) {
        session.user = {
          id: token.id,
          userId: token.userId,
          role: token.role
        };
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
