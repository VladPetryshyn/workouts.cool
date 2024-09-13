"use server";
import { COOKIE_KEY, getJwtSecretKey } from "./constants";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export interface SessionUser {
  id: string;
  username: string;
}

export const createToken = async (user: SessionUser) => {
  try {
    const value = await new SignJWT({ ...user })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .sign(getJwtSecretKey());

    cookies().set(COOKIE_KEY, value);
    return true;
  } catch (e) {
    console.error(e, "create token");
    return false;
  }
};

export const verifyJWT = async (value: string) => {
  try {
    const token = (await jwtVerify(value, getJwtSecretKey())).payload;
    return token as unknown as SessionUser;
  } catch (e) {
    console.error(e, "verfiy jwt");
    return undefined;
  }
};

export const updateTokenUsername = async (username: string) => {
  try {
    const origValue = cookies().get(COOKIE_KEY);
    const user = await verifyJWT(origValue!.value);
    if (user) {
      user.username = username;
      createToken(user);

      return user;
    }
  } catch (e) {
    console.error(e);
  }
};

export const getServerUser = async () => {
  const cookie = cookies().get(COOKIE_KEY);

  if (cookie?.value) {
    return await verifyJWT(cookie.value);
  }

  return undefined;
};
