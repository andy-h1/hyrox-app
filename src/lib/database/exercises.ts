import { prisma } from '@/lib/prisma';

export async function getExercisesList() {
  const allExercises = await prisma.exercise.findMany({
    select: {
      id: true,
      name: true,
      category: true,
    },
  });
  return allExercises;
}
