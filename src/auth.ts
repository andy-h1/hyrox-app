import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
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
      const existing = await prisma.appUser.findUnique({
        where: { email: user.email },
      });

      if (existing) {
        if (!existing.authUserId) {
          await prisma.appUser.update({
            where: { email: user.email },
            data: { authUserId: user.id },
          });
        }
        return;
      }

      await prisma.appUser.create({
        data: {
          email: user.email,
          name: user.name ?? 'New User',
          authUserId: user.id,
          passwordHash: '',
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
