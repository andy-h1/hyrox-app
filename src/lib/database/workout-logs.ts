import { prisma } from '../prisma';
import type { Lap } from '@/components/Stopwatch';

type LogWorkoutData = {
  userId: number;
  templateId: number;
  laps: Lap[];
};

// export async function getLoggedWorkouts(userId: number) {
//  try {
//     const workoutLogData = await
//  }
// }

export async function createWorkoutLog(data: LogWorkoutData) {
  const { userId, templateId, laps } = data;

  const exerciseLaps = laps.filter((l) => l.type === 'exercise');
  const restLaps = laps.filter((l) => l.type === 'rest');

  const totalWorkTime = Math.floor(exerciseLaps.reduce((acc, lap) => acc + lap.duration, 0) / 1000);
  const totalRestTime = Math.floor(restLaps.reduce((acc, lap) => acc + lap.duration, 0) / 1000);
  const totalDuration = totalWorkTime + totalRestTime;

  try {
    // Get template to know how many exercises per round
    const template = await prisma.workoutTemplate.findUnique({
      where: { id: templateId },
      include: { exercises: true },
    });

    const exercisesPerRound = template?.exercises.length || 1;
    const actualRoundsCompleted = Math.floor(exerciseLaps.length / exercisesPerRound);

    const workoutLog = await prisma.$transaction(async (tx) => {
      const log = await tx.workoutLog.create({
        data: {
          userId,
          templateId,
          completedAt: new Date(),
          roundsCompleted: actualRoundsCompleted,
          totalDuration,
          totalRestTime,
          totalWorkTime,
          status: 'COMPLETED', //TODO: Set status based on if the user completed all the rounds
        },
      });

      let currentRound = 1;
      let exerciseIndexInRound = 0;
      let roundStartTime: Date | null = null;
      let roundExercises: typeof exerciseLaps = [];
      let roundDuration = 0;

      for (let i = 0; i < exerciseLaps.length; i++) {
        const lap = exerciseLaps[i];

        if (exerciseIndexInRound === 0) {
          roundStartTime = new Date(lap.startedAt);
          roundExercises = [];
          roundDuration = 0;
        }

        roundExercises.push(lap);
        roundDuration += Math.floor(lap.duration / 1000);
        exerciseIndexInRound++;

        // Check if this completes a round
        const isRoundComplete = exerciseIndexInRound === exercisesPerRound;
        const isLastExercise = i === exerciseLaps.length - 1;

        if (isRoundComplete || isLastExercise) {
          const lapIndex = laps.indexOf(lap);
          const restAfter =
            laps[lapIndex + 1]?.type === 'rest'
              ? Math.floor(laps[lapIndex + 1].duration / 1000)
              : null;

          const round = await tx.workoutRound.create({
            data: {
              logId: log.id,
              roundNumber: currentRound,
              startedAt: roundStartTime!,
              completedAt: new Date(lap.completedAt),
              duration: roundDuration,
              restAfter,
            },
          });

          // Create exercise entries for this round
          for (const exerciseLap of roundExercises) {
            if (exerciseLap.exerciseId) {
              // Find rest after this exercise in the original laps array
              const lapIndex = laps.indexOf(exerciseLap);
              const restAfter =
                laps[lapIndex + 1]?.type === 'rest'
                  ? Math.floor(laps[lapIndex + 1].duration / 1000)
                  : null;

              await tx.roundExercise.create({
                data: {
                  roundId: round.id,
                  exerciseId: exerciseLap.exerciseId,
                  startedAt: new Date(exerciseLap.startedAt),
                  completedAt: new Date(exerciseLap.completedAt),
                  duration: Math.floor(exerciseLap.duration / 1000),
                  restAfter,
                  actualValue: exerciseLap.actualValue || exerciseLap.targetValue || 0,
                  actualUnit: exerciseLap.actualUnit || exerciseLap.targetUnit || 'reps',
                  scaled: false,
                },
              });
            }
          }

          currentRound++;
          exerciseIndexInRound = 0;
        }
      }

      return log;
    });
    return { success: true, workoutLog };
  } catch (error) {
    console.error('Error creating workout log:', error);
    throw error;
  }
}
