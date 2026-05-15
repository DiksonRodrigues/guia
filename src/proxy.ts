import { NextRequest, NextResponse } from "next/server";
import { computeToken } from "@/lib/admin-auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  const expected = await computeToken();
  if (token !== expected)
    return NextResponse.redirect(new URL("/admin/login", req.url));

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
