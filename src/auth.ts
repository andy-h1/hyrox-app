import NextAuth, { DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import ResendProvider from 'next-auth/providers/resend';
import { sendVerificationRequest } from '@/lib/sendAuthRequest';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    ResendProvider({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.RESEND_DOMAIN_EMAIL,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const existingAppUser = await prisma.appUser.findUnique({
            where: { email: user.email },
          });

          if (existingAppUser) {
            // If AppUser exists but no authUserId, update it
            if (!existingAppUser.authUserId && user.id) {
              await prisma.appUser.update({
                where: { id: existingAppUser.id },
                data: {
                  authUserId: user.id,
                  name: user.name || existingAppUser.name,
                },
              });
            }
          } else if (user.id) {
            // Create new AppUser if it doesn't exist
            await prisma.appUser.create({
              data: {
                email: user.email,
                name: user.name || 'New User',
                authUserId: user.id,
              },
            });
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl) return `${baseUrl}/after-login`;
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return `${baseUrl}/after-login`;
    },
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
