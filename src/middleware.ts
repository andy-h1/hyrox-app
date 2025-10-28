import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import { prisma } from './lib/prisma';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session.user.email) {
    try {
      const existingUser = await prisma.appUser.findFirst({
        where: {
          OR: [{ authUserId: session.user.id }, { email: session.user.email }],
        },
      });
      if (!existingUser) {
        await prisma.appUser.create({
          data: {
            email: session.user.email,
            name: session.user.name || 'New User',
            authUserId: session.user.id,
          },
        });
      } else if (!existingUser.authUserId) {
        await prisma.appUser.update({
          where: { id: existingUser.id },
          data: {
            authUserId: session.user.id,
            name: session.user.name || existingUser.name,
          },
        });
      }
    } catch (error) {
      console.error('Middleware user sync error:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
