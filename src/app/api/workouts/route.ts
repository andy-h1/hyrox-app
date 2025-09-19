import { NextRequest, NextResponse } from 'next/server';
import { createWorkout } from '@/lib/database/workouts';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received workout data', data);

    const newWorkout = await createWorkout(data, 1); // Hard-coded userId for now
    console.log('Workout created:', newWorkout);
    return NextResponse.json({ data: newWorkout }, { status: 201 });
  } catch (error) {
    console.log('Error in POST /api/workouts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
