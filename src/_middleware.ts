import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

interface sessionMiddleware {
  user?: JWT;
  success: boolean;
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", new URL("/", request.url).toString());
  const pathname = request.nextUrl.pathname;
  const successfulResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  if (pathname.startsWith("/profile")) return successfulResponse;

  const response = await getSessionInMiddleware(request);

  // redirect for the home page
  if (pathname === "/") {
    if (response.user)
      return NextResponse.redirect(
        new URL(`/profile/${response.user.id}`, request.url),
      );

    return NextResponse.redirect(new URL("/hero-page", request.url));
  }

  // if we have user, then response will be always successfull
  if (response.success) return successfulResponse;
  // redirect to the unathorized ui
  if (
    pathname.startsWith("/workout-editor") ||
    pathname.startsWith("/article-editor")
  ) {
    return NextResponse.redirect(new URL("/unathorized", request.url));
  }

  return new Response("Unauthorized", { status: 401 });
}

export const config = {
  matcher: [
    "/workout-editor/:path*",
    "/article-editor/:path*",
    "/",
    "/api/workouts/create",
    "/api/workouts/update",
    "/api/articles/create",
    "/api/articles/update",
    "/profile/:id*",
  ],
};

async function getSessionInMiddleware(request: NextRequest) {
  const output: sessionMiddleware = { user: undefined, success: false };
  const c = cookies();
  const allCookies = c
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  /**
   * If next-auth.session-token is not present, return 401
   * (!) IMPORTANT NOTE HERE:
   * next-auth likes to use different cookie name for prod (https) so make sure to set a consistent cookie name in your next-auth configuration file (see docs)
   */
  const tokenKey =
    process.env.NODE_ENV === "development"
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token";
  const sessionToken = c.get(tokenKey)?.value?.trim();

  if (!sessionToken) {
    return output;
  }

  const headers = {
    "Content-Type": "application/json",
    Cookie: allCookies,
  };

  /**
   * Send a request to /api/auth/session to get the user session
   * process.LOOPBACK_URL can be set as localhost, or your website url
   */
  const url = new URL("/api/auth/session", request.url);
  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (response.ok) {
    const content = await response.json();
    output.user = content.user;
    output.success = true;

    return output;
  }

  return output;
}
