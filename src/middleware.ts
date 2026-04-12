import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const pathname = req.nextUrl.pathname;

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/profiles", req.url));
    }

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/profiles", "/login", "/signup"],
};
