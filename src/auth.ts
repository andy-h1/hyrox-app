/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import Resend from 'next-auth/providers/resend';
import { sendVerificationRequest } from './lib/sendAuthRequest';

function setSessionUserId(session: any, userId?: string) {
  if (!session.user) session.user = {} as any;
  if (userId) (session.user as any).id = userId;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.RESEND_DOMAIN_EMAIL,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
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
      }
      return true;
    },

    async session({ session, user, token }) {
      const authUserId = user?.id ?? (typeof token?.sub === 'string' ? token.sub : undefined);
      setSessionUserId(session, authUserId);
      console.log({ session });
      return session;
    },

    async redirect({ url, baseUrl }) {
      const isSameOrigin = url.startsWith(baseUrl);
      const isRelative = url.startsWith('/');
      if (isSameOrigin || isRelative) return url;
      return `${baseUrl}/after-login`;
    },
  },
});
