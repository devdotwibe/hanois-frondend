import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["en", "ar"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  return NextResponse.next();
}
