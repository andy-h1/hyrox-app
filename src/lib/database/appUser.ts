import { prisma } from '@/lib/prisma';

export const updateUserProfile = async (
  userId: number,
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
      where: { id: userId },
      data: cleanUser,
    });

    const profile = await tx.profile.upsert({
      where: { id: userId },
      update: cleanProfile,
      create: { userId, ...cleanProfile },
    });

    return { user, profile };
  });
};
