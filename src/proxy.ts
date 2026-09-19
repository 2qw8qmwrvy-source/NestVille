import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const protectedPrefixes = ["/dashboard", "/listings/new", "/roommates/new"];
const authOnlyRoutes = ["/login", "/signup"];

function isEditRoute(pathname: string) {
  return /^\/(listings|roommates)\/[^/]+\/edit$/.test(pathname);
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
    isEditRoute(pathname);
  const isAuthOnly = authOnlyRoutes.includes(pathname);

  if (!isProtected && !isAuthOnly) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtected && !session?.userId) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnly && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)"],
};
