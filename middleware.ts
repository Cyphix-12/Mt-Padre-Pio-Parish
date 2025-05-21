import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/auth/reset-password'];
const API_ROUTES = ['/api'];
const ROLE_PROTECTED_ROUTES = {
  '/settings': ['Admin'],
  '/api/list-users': ['Admin'],
  '/api/create-user': ['Admin'],
  '/api/delete-user': ['Admin'],
  '/api/update-user-role': ['Admin']
};

export async function middleware(req: NextRequest) {
  const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);
  const isApiRoute = API_ROUTES.some(route => req.nextUrl.pathname.startsWith(route));
  const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('sb-token')?.value;

  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Verify authentication
  if (!token) {
    if (isApiRoute) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check role-based access
  if (isApiRoute) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|android-chrome-192x192.png|android-chrome-512x512.png|apple-touch-icon.png|favicon-16x16.png|favicon-32x32.png|site.webmanifest).*)',
  ],
};