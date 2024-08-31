import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createUrlBase } from "./lib/urlCreators";
import { JWT } from "next-auth/jwt";

interface sessionMiddleware {
  user?: JWT;
  success: boolean;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = await getSessionInMiddleware();

  // redirect for the home page
  if (pathname === "/") {
    if (response.user)
      return NextResponse.redirect(
        createUrlBase(`/profile/${response.user.id}`),
      );

    return NextResponse.redirect(createUrlBase("/hero-page"));
  }

  // if we have user, then response will be always successfull
  if (response.success) return;

  // redirect to the unathorized ui
  if (
    pathname.startsWith("/workout-editor") ||
    pathname.startsWith("/article-editor")
  ) {
    return NextResponse.redirect(new URL("/unathorized", request.url));
  }

  // responsd with unathorized for the api routes
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
  ],
};

async function getSessionInMiddleware() {
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
  const sessionToken = c.get("next-auth.session-token")?.value?.trim();

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
  const url = createUrlBase("/api/auth/session");
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
