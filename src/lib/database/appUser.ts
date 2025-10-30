import { prisma } from '@/lib/prisma';

export const updateUserProfile = async (
  authUserId: string,
  updates: {
    name?: string;
    bio?: string;
    height?: number;
    weight?: number;
    avatarUrl?: string;
  },
) => {
  const userUpdates = { name: updates.name };
  const profileUpdates = {
    bio: updates.bio,
    height: updates.height,
    weight: updates.weight,
    avatarUrl: updates.avatarUrl,
  };

  const cleanUser = Object.fromEntries(
    Object.entries(userUpdates).filter(([_, v]) => v !== undefined),
  );
  const cleanProfile = Object.fromEntries(
    Object.entries(profileUpdates).filter(([_, v]) => v !== undefined),
  );

  return await prisma.$transaction(async (tx) => {
    const user = await tx.appUser.update({
      where: { authUserId },
      data: cleanUser,
    });

    console.log(user.id);

    const profile = await tx.profile.upsert({
      where: { userId: user.id },
      update: cleanProfile,
      create: { userId: user.id, ...cleanProfile },
    });

    return { user, profile };
  });
};
