import { NextResponse } from 'next/server';
import { getExercisesList } from '@/lib/database/exercises';

export async function GET() {
  const allExercises = await getExercisesList();

  return NextResponse.json({ data: allExercises }, { status: 200 });
}
