import { NextResponse } from "next/server";

export function middleware(request) {
    const authCookie = request.cookies.get("auth_session");

    // Allow requests for API routes and static assets to bypass middleware
    if (
        request.nextUrl.pathname.startsWith("/api") || // Allow API routes
        request.nextUrl.pathname.startsWith("/_next") || // Allow Next.js assets
        request.nextUrl.pathname.startsWith("/favicon.ico") || // Allow favicon
        request.nextUrl.pathname.startsWith("/static") ||// Allow custom static files
        request.nextUrl.pathname === "/"
    ) {
        return NextResponse.next();
    }

    // If the user is not signed in, redirect all non-excluded routes to "/"
    if (!authCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

// Matcher to catch all URLs
export const config = {
    matcher: "/:path*",
};
