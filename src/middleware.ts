import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(request: NextRequest) {
  console.log('Middleware hit:', request.nextUrl.pathname);
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Create response with pathname header for layout
  const response =
    pathname === '/' || pathname === '/login'
      ? NextResponse.next()
      : !session?.user?.id
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.next();

  // Add pathname to headers so layout can access it
  response.headers.set('x-pathname', pathname);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
