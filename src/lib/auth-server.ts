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

  const user = await prisma.appUser.findFirst({
    where: {
      OR: [{ authUserId: session.user.id }, { email: session.user.email ?? undefined }],
    },
    include: { profile: true },
  });

  return user;
});
