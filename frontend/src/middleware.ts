// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { configs } from "@/configs";

// Paths that require NOT being logged in
const authPaths = [
    "/login", 
    "/signup"
];
export async function middleware(req: NextRequest) {
    const token = req.cookies.get(configs.ACCESS_TOKEN_COOKIE_TAG)?.value;
    const url = req.nextUrl.clone();


    // If no token -> only block protected pages
    if (!token) {
        if (authPaths.includes(url.pathname)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        await jwtVerify(token, configs.JWT_SECRET);
    
        if (authPaths.includes(url.pathname)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        const res = NextResponse.next();

        return res;
    } catch {

        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.set({
            name: configs.ACCESS_TOKEN_COOKIE_TAG,
            value: "",
            path: "/",
            expires: new Date(0),
        });
        return response;
    }
}

export const config = {
    matcher: [
        "/login",
        "/signup",
        "/dashboard",
        "/dashboard/:path*",
        "/admins",
        "/admins/:path*",
        "/stores",
        "/stores/:path*",
        "/profile",
        "/profile/:path*",
        "/users",
        "/users/:path*",
    ],
};