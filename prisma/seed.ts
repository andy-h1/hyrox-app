import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // NOTE: If you're logged in with OAuth, you may need to transfer workouts to your user
  // Run: npx tsx -e "import {PrismaClient} from '@prisma/client'; const p = new PrismaClient(); p.workoutLog.updateMany({where:{userId:1},data:{userId:YOUR_USER_ID}}).then(console.log).finally(()=>p.$disconnect())"

  const user1 = await prisma.appUser.upsert({
    where: { email: 'test-user@hyrox-local.app' },
    update: {},
    create: {
      email: 'test-user@hyrox-local.app',
      name: 'Test Useer',
    },
  });

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
    { name: 'Farmers carry', category: 'strength' },

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

  // Create 3 friends for the leaderboard
  const friendsData = [
    { email: 'sarah.miller@example.com', name: 'Sarah Miller' },
    { email: 'mike.johnson@example.com', name: 'Mike Johnson' },
    { email: 'emma.wilson@example.com', name: 'Emma Wilson' },
  ];

  const friends = [];
  for (const friendData of friendsData) {
    const friend = await prisma.appUser.upsert({
      where: { email: friendData.email },
      update: { name: friendData.name },
      create: friendData,
    });
    friends.push(friend);
    console.log(`✅ Created/found friend: ${friend.name}`);
  }

  // Find or create Sled Push exercise for the challenge
  const sledPushExercise = await prisma.exercise.findFirst({
    where: { name: 'Sled Push' },
  });

  if (!sledPushExercise) {
    throw new Error('Sled Push exercise not found');
  }

  // Create this week's challenge
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  const challenge = await prisma.challenge.upsert({
    where: {
      id: 1,
    },
    update: {
      name: 'Fastest Sled Push',
      description: 'Complete a 50m sled push as fast as possible. May the best athlete win!',
      startDate: startOfWeek,
      endDate: endOfWeek,
      challengeType: 'TIME_TRIAL',
      targetExerciseId: sledPushExercise.id,
      targetValue: 50,
    },
    create: {
      name: 'Fastest Sled Push',
      description: 'Complete a 50m sled push as fast as possible. May the best athlete win!',
      startDate: startOfWeek,
      endDate: endOfWeek,
      challengeType: 'TIME_TRIAL',
      targetExerciseId: sledPushExercise.id,
      targetValue: 50,
    },
  });

  console.log('✅ Created/updated challenge: Fastest Sled Push');

  // Create leaderboard results with realistic times (in seconds)
  const leaderboardData = [
    { user: user1, time: 45.23, rank: 2 }, // You're in 2nd place
    { user: friends[0], time: 43.87, rank: 1 }, // Sarah is fastest
    { user: friends[1], time: 47.91, rank: 3 }, // Mike is 3rd
    { user: friends[2], time: 51.45, rank: 4 }, // Emma is 4th
  ];

  for (const entry of leaderboardData) {
    await prisma.challengeResult.upsert({
      where: {
        challengeId_userId: {
          challengeId: challenge.id,
          userId: entry.user.id,
        },
      },
      update: {
        resultValue: entry.time,
        rank: entry.rank,
      },
      create: {
        challengeId: challenge.id,
        userId: entry.user.id,
        resultValue: entry.time,
        rank: entry.rank,
      },
    });
    console.log(
      `✅ Created/updated result for ${entry.user.name}: ${entry.time}s (Rank: ${entry.rank})`,
    );
  }

  // Create workout templates FIRST (before workout logs)
  const HyroxMonTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Hyrox station for Monday',
      targetRounds: 2,
      description: 'Complete 2 rounds',
      createdBy: user1.id,
      format: 'FOR_TIME',
      duration: 2700,
      isPublic: true,
      exercises: {
        create: [
          { exerciseId: 1, targetValue: 800, targetUnit: 'meters', orderIndex: 1 },
          { exerciseId: 2, targetValue: 500, targetUnit: 'meters', orderIndex: 2 },
          { exerciseId: 6, targetValue: 40, targetUnit: 'meters', orderIndex: 3 },
          { exerciseId: 7, targetValue: 40, targetUnit: 'meters', orderIndex: 4 },
        ],
      },
    },
  });
  console.log('✅ Created workout template: Hyrox station for Monday');

  const HyroxWedTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Hyrox station for Wednesday',
      targetRounds: 2,
      description: 'Complete 2 rounds',
      createdBy: user1.id,
      format: 'FOR_TIME',
      duration: 1800,
      isPublic: true,
      exercises: {
        create: [
          {
            exerciseId: 1,
            targetValue: 1000,
            targetUnit: 'meters',
            orderIndex: 1,
          },
          {
            exerciseId: 3,
            targetValue: 750,
            targetUnit: 'meters',
            orderIndex: 2,
          },
          {
            exerciseId: 8,
            targetValue: 40,
            targetUnit: 'meters',
            orderIndex: 3,
          },
          {
            exerciseId: 11,
            targetValue: 150,
            targetUnit: 'meters',
            orderIndex: 4,
          },
        ],
      },
    },
  });
  console.log('✅ Created workout template: Hyrox station for Wednesday');

  const HyroxFriTemplate = await prisma.workoutTemplate.create({
    data: {
      name: 'Hyrox station for Friday',
      targetRounds: 2,
      description: 'Complete 2 rounds',
      createdBy: user1.id,
      format: 'FOR_TIME',
      duration: 1800,
      isPublic: true,
      exercises: {
        create: [
          {
            exerciseId: 2,
            targetValue: 250,
            targetUnit: 'meters',
            orderIndex: 1,
          },
          {
            exerciseId: 3,
            targetValue: 250,
            targetUnit: 'meters',
            orderIndex: 2,
          },
          {
            exerciseId: 9,
            targetValue: 20,
            targetUnit: 'reps',
            orderIndex: 3,
          },
          {
            exerciseId: 11,
            targetValue: 80,
            targetUnit: 'meters',
            orderIndex: 4,
          },
        ],
      },
    },
  });
  console.log('✅ Created workout template: Hyrox station for Friday');

  // NOW create workout logs using the template IDs
  const daysAgo = [1, 3, 5]; // Monday, Wednesday, Friday (assuming today varies)
  const templates = [HyroxMonTemplate, HyroxWedTemplate, HyroxFriTemplate];

  for (let i = 0; i < daysAgo.length; i++) {
    const workoutDate = new Date();
    workoutDate.setDate(workoutDate.getDate() - daysAgo[i]);
    workoutDate.setHours(18, 30, 0, 0); // 6:30 PM

    console.log(`Creating workout log for: ${workoutDate.toISOString()}`);

    const template = templates[i];

    // Get template exercises
    const templateExercises = await prisma.templateExercise.findMany({
      where: { templateId: template.id },
      orderBy: { orderIndex: 'asc' },
    });

    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId: user1.id,
        templateId: template.id,
        completedAt: workoutDate,
        roundsCompleted: 2,
        totalDuration: 1800 + Math.floor(Math.random() * 300), // 30-35 minutes
        totalWorkTime: 1500 + Math.floor(Math.random() * 200),
        totalRestTime: 300 + Math.floor(Math.random() * 100),
        status: 'COMPLETED',
        notes: 'Felt strong today!',
      },
    });

    // Create rounds for the workout with exercises
    for (let roundNum = 1; roundNum <= 2; roundNum++) {
      const roundStartTime = new Date(workoutDate);
      roundStartTime.setMinutes(roundStartTime.getMinutes() + (roundNum - 1) * 15);

      const roundEndTime = new Date(roundStartTime);
      roundEndTime.setMinutes(roundEndTime.getMinutes() + 12 + Math.floor(Math.random() * 3));

      const duration = Math.floor((roundEndTime.getTime() - roundStartTime.getTime()) / 1000);

      const workoutRound = await prisma.workoutRound.create({
        data: {
          logId: workoutLog.id,
          roundNumber: roundNum,
          startedAt: roundStartTime,
          completedAt: roundEndTime,
          duration: duration,
          restAfter: roundNum < 2 ? 120 : null, // 2 min rest between rounds
        },
      });

      // Create round exercises for this round
      let exerciseStartTime = new Date(roundStartTime);
      for (let exIdx = 0; exIdx < templateExercises.length; exIdx++) {
        const templateExercise = templateExercises[exIdx];
        const isLastExerciseInRound = exIdx === templateExercises.length - 1;

        const exerciseDuration =
          Math.floor(duration / templateExercises.length) + Math.floor(Math.random() * 30 - 15);
        const exerciseEndTime = new Date(exerciseStartTime);
        exerciseEndTime.setSeconds(exerciseEndTime.getSeconds() + exerciseDuration);

        // Add 30-60 seconds rest between exercises (except after last exercise in round)
        const restAfter = !isLastExerciseInRound ? 30 + Math.floor(Math.random() * 30) : null;

        await prisma.roundExercise.create({
          data: {
            roundId: workoutRound.id,
            exerciseId: templateExercise.exerciseId,
            startedAt: exerciseStartTime,
            completedAt: exerciseEndTime,
            duration: exerciseDuration,
            restAfter,
            actualValue: templateExercise.targetValue,
            actualUnit: templateExercise.targetUnit,
            scaled: false,
          },
        });

        exerciseStartTime = new Date(exerciseEndTime);
        if (restAfter) {
          exerciseStartTime.setSeconds(exerciseStartTime.getSeconds() + restAfter);
        }
      }
    }

    console.log(`✅ Created workout log for ${workoutDate.toLocaleDateString()}`);
  }

  await prisma.workoutTemplate.create({
    data: {
      name: 'Easy Hyrox session',
      targetRounds: 2,
      description: 'Simple session for testing',
      createdBy: user1.id,
      format: 'FOR_TIME',
      isPublic: true,
      exercises: {
        create: [
          {
            exerciseId: 1,
            targetValue: 1000,
            targetUnit: 'meters',
            orderIndex: 1,
          },
          {
            exerciseId: 3,
            targetValue: 1000,
            targetUnit: 'meters',
            orderIndex: 2,
          },
        ],
      },
    },
  });

  console.log('✅ Seed data complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Template:
// 800m run -> 750m Row -> Burpee broad jumps 40m -> Farmers carry 150m
