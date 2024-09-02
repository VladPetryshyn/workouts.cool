import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(request) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", new URL("/", request.url).toString());
    const pathname = request.nextUrl.pathname;
    const successfulResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    if (pathname.startsWith("/profile")) return successfulResponse;

    const token = request.nextauth.token;
    // const response = await getSessionInMiddleware(request);

    // redirect for the home page
    if (pathname === "/") {
      if (token)
        return NextResponse.redirect(
          new URL(`/profile/${token.id}`, request.url),
        );

      return NextResponse.redirect(new URL("/hero-page", request.url));
    }

    // if we have user, then response will be always successfull
    if (token) return successfulResponse;

    // redirect to the unathorized ui
    if (
      pathname.startsWith("/workout-editor") ||
      pathname.startsWith("/article-editor")
    ) {
      return NextResponse.redirect(new URL("/unathorized", request.url));
    }

    return new Response("Unauthorized", { status: 401 });
  },
  {
    secret: process.env.AUTH_SECRET,
    callbacks: {
      authorized: () => true,
    },
  },
);

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
