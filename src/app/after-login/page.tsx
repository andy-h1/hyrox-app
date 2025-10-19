import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AfterLogin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  try {
    // Try to find AppUser by authUserId first
    let appUser = await prisma.appUser.findFirst({
      where: { authUserId: session.user.id },
      include: { profile: true },
    });

    // If not found by authUserId but we have email, try to find and link
    if (!appUser && session.user.email) {
      appUser = await prisma.appUser.findFirst({
        where: { email: session.user.email },
        include: { profile: true },
      });

      // If found by email, update the authUserId
      if (appUser && !appUser.authUserId) {
        appUser = await prisma.appUser.update({
          where: { id: appUser.id },
          data: {
            authUserId: session.user.id,
            name: session.user.name || appUser.name,
          },
          include: { profile: true },
        });
      }
    }

    // If still no AppUser, redirect to profile to create one
    if (!appUser) {
      redirect('/profile');
    }

    // Check if profile exists
    if (!appUser.profile) {
      redirect('/profile');
    }

    // All good, redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    console.error('Error in after-login:', error);
    // On any error, send to profile page to handle
    redirect('/profile');
  }
}
