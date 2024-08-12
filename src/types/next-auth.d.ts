import NextAuth, {
  DefaultSession,
  AdapterUser as _AdapterUser,
} from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      email: string;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    email: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
  }
}
