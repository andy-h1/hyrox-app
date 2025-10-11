import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create exercises
  const exercises = [
    // Cardio
    { name: 'Run', category: 'cardio' },
    { name: 'Ski Erg', category: 'cardio' },
    { name: 'Row', category: 'cardio' },
    { name: 'Bike', category: 'cardio' },

    // Strength
    { name: 'Sled Push', category: 'strength' },
    { name: 'Sled Pull', category: 'strength' },
    { name: 'Burpee Broad Jump', category: 'strength' },
    { name: 'Wall Balls', category: 'strength' },
    { name: 'Lunges', category: 'strength' },

    // Additional Training Exercises
    { name: 'Squats', category: 'strength' },
    { name: 'Overhead Press', category: 'strength' },
    { name: 'Pull-ups', category: 'strength' },
    { name: 'Push-ups', category: 'strength' },
    { name: 'Sit-ups', category: 'strength' },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
