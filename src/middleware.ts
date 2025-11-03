import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SUPPORTED_LANGS = ["en", "ar"];

const JWT_SECRET = "a3f9b0e1a8c2d34e5f67b89a0c1d2e3f4a5b6c7d8e9f00112233445566778899";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🌐 Handle language routing
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (SUPPORTED_LANGS.includes(firstSegment)) {
    const lang = firstSegment;
    const newPath = "/" + segments.slice(1).join("/");

    const url = request.nextUrl.clone();
    url.pathname = newPath || "/";
    url.searchParams.set("lang", lang);

    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("token")?.value;

    console.log("🔍 Token in middleware:", token);

    if (!token) {

      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // try {

    //   jwt.verify(token, JWT_SECRET);

    //   return NextResponse.next();
    // } catch (err) {
    //   console.error("❌ JWT verification failed:", err);
    //   return NextResponse.redirect(new URL("/admin/login", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/admin/:path*"],
};
