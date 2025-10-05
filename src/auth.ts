import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [Google],
  events: {
    async createUser({ user }) {
      if (!user?.email) return;

      await prisma.appUser.upsert({
        where: { email: user.email },
        create: {
          email: user.email,
          name: user.name ?? 'New User',
          authUserId: user.id,
          passwordHash: null,
        },
        update: {
          name: user.name ?? 'New User',
          authUserId: user.id,
        },
      });
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/after-login`;
    },
  },
});
