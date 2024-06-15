import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  "/",
  "/app/(marketing)/*",
  "/app/(public)/*",
];

function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => new RegExp(`^${route}$`).test(path));
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isPublicRoute(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  return clerkMiddleware()(req, event);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
