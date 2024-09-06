import { verifyJWT } from "@/lib/auth";
import { COOKIE_KEY } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const unauthenticatedResponse = NextResponse.json({}, { status: 401 });
export const GET = async () => {
  const cookie = cookies().get(COOKIE_KEY);

  if (!cookie?.value) return unauthenticatedResponse;

  try {
    const user = await verifyJWT(cookie.value);
    if (user) return NextResponse.json(user);

    return unauthenticatedResponse;
  } catch (e) {
    console.error(e);
    return unauthenticatedResponse;
  }
};
