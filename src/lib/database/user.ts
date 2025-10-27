// TODO: Use to get user details
import { prisma } from '../prisma';

export const getUserDetails = async (id: number) => {
  try {
    const userData = await prisma.appUser.findUnique({
      where: { id },
      select: {
        email: true,
        name: true,
        workouts: true,
        personalRecords: true,
        challengeResults: true,
        createdTemplates: true,
        sharedTemplates: true,
        profile: true,
      },
    });

    return userData;
  } catch (error) {
    console.error(`Issues getting user data: ${error}`);
  }
};
