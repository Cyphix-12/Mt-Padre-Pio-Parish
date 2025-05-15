import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/api/auth', '/api/list-users'];
const API_ROUTES = ['/api/auth'];

export async function middleware(req: NextRequest) {
  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);
  const isApiRoute = API_ROUTES.some(route => req.nextUrl.pathname.startsWith(route));

  // Add CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Only handle API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};