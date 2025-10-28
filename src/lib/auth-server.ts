import { auth } from '@/auth';
import { prisma } from './prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';

type UserWithProfile = Prisma.AppUserGetPayload<{ include: { profile: true } }>;

export const getServerSession = cache(async () => {
  return await auth();
});

export const getCurrentUser = cache(async (): Promise<UserWithProfile | null> => {
  const session = await getServerSession();

  if (!session?.user?.id) return null;

  let user = await prisma.appUser.findFirst({
    where: {
      OR: [{ authUserId: session.user.id }, { email: session.user.email ?? undefined }],
    },
    include: { profile: true },
  });

  if (!user && session.user.email) {
    user = await prisma.appUser.findUnique({
      where: { email: session.user.email },
      include: { profile: true },
    });
  }

  if (user && !user.authUserId) {
    user = await prisma.appUser.update({
      where: { id: user.id },
      data: {
        authUserId: session.user.id,
        name: session.user.name || user.name,
      },
      include: { profile: true },
    });
  }

  if (!user && session.user.email) {
    user = await prisma.appUser.create({
      data: {
        email: session.user.email,
        name: session.user.name || 'New User',
        authUserId: session.user.id,
      },
      include: { profile: true },
    });
  }

  return user;
});
