import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.appUser.findUnique({
    where: { authUserId: session.user.id },
  });
}
