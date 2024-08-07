import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession, type NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInScheme } from "@/app/auth/validation";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = signInScheme.safeParse(credentials);
        if (result.success) {
          await connectDB();
          const user = await User.findOne({
            email: credentials?.email,
          }).select("+password");

          if (!user)
            throw new Error(JSON.stringify({ email: ["Wrong Email!"] }));

          const passwordMatch = await bcrypt.compare(
            credentials!.password,
            user.password,
          );

          if (!passwordMatch)
            throw new Error(
              JSON.stringify({ passwordError: "Wrong Password" }),
            );
          return user;
        } else {
          throw new Error(
            JSON.stringify(result?.error?.formErrors?.fieldErrors),
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
