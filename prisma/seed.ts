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
    { name: 'Assault Bike', category: 'cardio' },

    // Strength
    { name: 'Sled Push', category: 'strength' },
    { name: 'Sled Pull', category: 'strength' },
    { name: 'Burpee Broad Jump', category: 'strength' },
    { name: 'Wall Balls', category: 'strength' },
    { name: 'Walking Lunges', category: 'strength' },

    // Additional Training Exercises
    { name: 'Back Squats', category: 'strength' },
    { name: 'Front Squats', category: 'strength' },
    { name: 'Bulgarian Split Squats', category: 'strength' },
    { name: 'Deadlifts', category: 'strength' },
    { name: 'Romanian Deadlifts', category: 'strength' },

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

  const workoutTemplates = [
    //
    {
      name: 'Hyrox template 1',
      description: 'Complete as many rounds as you can in 30 mins',
      createdBy: 1,
      format: 'AMRAP',
      duration: 1800,

      exercises: {
        exerciseId: 1,
        targetValue: 1000,
        targetUnit: 'meters',
        orderIndex: 1,
      },
    },
  ];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
