import { NextRequest, NextResponse } from "next/server";

async function computeToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "changeme";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(password)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
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
