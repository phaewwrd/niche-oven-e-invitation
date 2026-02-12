import { auth } from "@niche-e-invitation/auth";
import { nextCookies } from "better-auth/next-js";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const { pathname } = request.nextUrl;

    // 1. Protect dashboard routes -> must be authenticated
    if (pathname.startsWith("/dashboard") && !session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Protect admin routes -> must be role = admin
    if (pathname.startsWith("/admin") && session?.user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Note: Blocking expired events or editing expired events 
    // is better handled in the Page or Service layer (we already do this in getInvitationBySlug).
    // But we could add a check here if we wanted to be strictly middleware-based.

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/api/:path*", // Protect admin/user API routes if needed
    ],
};
