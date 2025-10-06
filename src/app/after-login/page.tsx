import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AfterLogin() {
  const session = await auth();

  console.log('Session in after-login:', session);

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const appUser = await prisma.appUser.findFirst({
    where: { authUserId: session.user.id },
    include: { profile: true },
  });

  if (!appUser?.profile) {
    redirect('/profile');
  }

  redirect('/dashboard');
}
