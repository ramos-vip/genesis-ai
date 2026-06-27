import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Routes that are accessible without authentication.
 * Patterns use path-to-regexp syntax.
 */
const isPublicRoute = createRouteMatcher([
  "/",              // Landing page
  "/login(.*)",     // Sign-in (and all sub-paths for Clerk's flow)
  "/signup(.*)",    // Sign-up
  "/reset-password(.*)",
  "/api/webhooks(.*)", // Clerk webhooks — must be public
]);

/**
 * Routes that should redirect authenticated users away.
 * (Signed-in users visiting /login should go to /dashboard)
 */
const isAuthRoute = createRouteMatcher([
  "/login(.*)",
  "/signup(.*)",
  "/reset-password(.*)",
]);

export const proxy = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Authenticated users visiting auth pages → redirect to dashboard
  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Non-public routes require authentication
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Run proxy on all routes except:
     * - static files (_next/static, _next/image)
     * - favicon / sitemap / robots
     * - public directory assets (images, fonts)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
    "/(api|trpc)(.*)",
  ],
};
