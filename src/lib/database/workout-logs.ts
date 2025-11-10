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

  const totalWorkTime = Math.floor(exerciseLaps.reduce((acc, lap) => acc + lap.duration, 0));
  const totalRestTime = Math.floor(restLaps.reduce((acc, lap) => acc + lap.duration, 0));
  const totalDuration = totalWorkTime + totalRestTime;

  try {
    const workoutLog = await prisma.$transaction(async (tx) => {
      const log = await tx.workoutLog.create({
        data: {
          userId,
          templateId,
          completedAt: new Date(),
          roundsCompleted: exerciseLaps.length,
          totalDuration,
          totalRestTime,
          totalWorkTime,
          status: 'COMPLETED', //TODO: Set status based on if the user completed all the rounds
        },
      });

      let currentRound = 1;

      for (const lap of exerciseLaps) {
        const lapIndex = laps.indexOf(lap);
        const restAfter =
          laps[lapIndex + 1]?.type === 'rest'
            ? Math.floor(laps[lapIndex + 1].duration / 1000)
            : null;

        const round = await tx.workoutRound.create({
          data: {
            logId: log.id,
            roundNumber: currentRound,
            startedAt: new Date(lap.startedAt),
            completedAt: new Date(lap.completedAt),
            duration: Math.floor(lap.duration / 1000),
            restAfter,
          },
        });

        if (lap.exerciseId) {
          await tx.roundExercise.create({
            data: {
              roundId: round.id,
              exerciseId: lap.exerciseId,
              startedAt: new Date(lap.startedAt),
              completedAt: new Date(lap.completedAt),
              duration: Math.floor(lap.duration / 1000),
              actualValue: lap.actualValue || lap.targetValue || 0,
              actualUnit: lap.actualUnit || lap.targetUnit || 'reps',
              scaled: false,
            },
          });
        }

        currentRound++;
      }

      return log;
    });
    return { success: true, workoutLog };
  } catch (error) {
    console.error('Error creating workout log:', error);
    throw error;
  }
}
