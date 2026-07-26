import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/dashboard")) {
      if (
        token?.role !== "USER" &&
        token?.role !== "ADMIN"
      ) {
        return NextResponse.redirect(
          new URL("/auth/login", req.url)
        );
      }
    }

    if (pathname.startsWith("/attacker/dashboard")) {
      if (token?.role !== "ATTACKER") {
        return NextResponse.redirect(
          new URL("/auth/login", req.url)
        );
      }
    }

    if (pathname.startsWith("/admin/dashboard")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/auth/login", req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/dashboard/:path*",
    "/attacker/dashboard/:path*",
  ],
};