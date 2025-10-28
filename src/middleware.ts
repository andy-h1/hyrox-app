import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import { prisma } from './lib/prisma';

export async function middleware(request: NextRequest) {
  console.log('Middleware hit:', request.nextUrl.pathname);
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
