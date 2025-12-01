import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected routes that require authentication
const isProtected = createRouteMatcher(["/dashboard(.*)"]);

// API routes that should be proxied
const apiRoutes = [
  "/api/auth",
  // Add other API routes that need to be proxied
];

// Paths that should be publicly accessible
const publicPaths = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/trpc(.*)",
  "/_next/static(.*)",
  "/_next/image(.*)",
  "/favicon.ico",
  // Add other public paths as needed
];

// Proxy configuration
const API_URL = process.env.API_URL || "http://localhost:3000";

async function handleApiProxy(req) {
  const url = new URL(req.nextUrl.pathname.replace(/^\/api\//, "/"), API_URL);
  const headers = new Headers(req.headers);

  // Add any required headers for your API
  headers.set("x-forwarded-for", req.ip || "");
  headers.set("x-forwarded-host", req.nextUrl.host);
  headers.set("x-forwarded-proto", req.nextUrl.protocol.replace(":", ""));

  // Forward cookies if needed
  const cookies = req.cookies.toString();
  if (cookies) {
    headers.set("cookie", cookies);
  }

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: req.body,
      redirect: "follow",
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(JSON.stringify({ error: "Proxy error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Handle API proxy
  if (pathname.startsWith("/api/")) {
    return handleApiProxy(req);
  }

  // Protect routes
  if (isProtected(req)) {
    // ✅ correct usage in middleware
    await auth.protect();
    // fall through to NextResponse.next() implicitly
    return NextResponse.next();
  }

  // Allow public paths
  if (
    publicPaths.some(
      (path) =>
        path === pathname ||
        (path.endsWith("(.*)") &&
          new RegExp(`^${path.replace("(.*)", ".*")}$`).test(pathname))
    )
  ) {
    return NextResponse.next();
  }

  // Default deny for any other routes
  return NextResponse.redirect(new URL("/sign-in", req.url));
});

export const config = {
  matcher: [
    // Skip static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml|woff|woff2|ttf|eot|css|js)$).*)",
    // Include API routes
    "/(api|trpc)(.*)",
  ],
};
