import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "./lib/auth";

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

  const user = await getServerUser();

  // redirect for the home page
  if (pathname === "/") {
    if (user)
      return NextResponse.redirect(new URL(`/profile/${user.id}`, request.url));

    return NextResponse.redirect(new URL("/hero-page", request.url));
  }

  // if we have user, then response will be always successfull
  if (user) return successfulResponse;
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
