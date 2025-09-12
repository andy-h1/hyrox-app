import { NextRequest, NextResponse } from 'next/server';
import { createWorkout } from '@/lib/database/workouts';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newWorkout = await createWorkout(data, 1); // Hard-coded userId for now

  return NextResponse.json({ data: newWorkout }, { status: 201 });
}
