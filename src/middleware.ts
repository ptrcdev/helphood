import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // List of protected routes
  const protectedRoutes = ['/requester-dashboard', '/profile'];
  const protectedRoutesIfLoggedIn = ['/signin', '/signup'];
  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If there's no token, redirect to login
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }

  // Check if the route is protected if user is logged in
  if (protectedRoutesIfLoggedIn.some((route) => pathname.startsWith(route))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If there's no token, redirect to login
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/requester-dashboard/:path*', '/profile/:path*', '/signin', '/signup'],
};