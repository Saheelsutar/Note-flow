import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { promises as fs } from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "public", "uploads");

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        console.log("Google sign-in detected");

        const userFolder = path.join(BASE_DIR, user.name);
        
        try {
          // Check if folder exists, if not, create it
          await fs.access(userFolder);
        } catch (error) {
          console.log(`Creating folder for user: ${user.name}`);
          await fs.mkdir(userFolder, { recursive: true });
        }

        return true;
      }
      return false;
    },
    async session({ session }) {
      if (session.user) {
        session.user.folderPath = `/uploads/${session.user.name}`;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
