import { NextRequest, NextResponse } from 'next/server';
import { createWorkoutTemplate } from '@/lib/database/workouts';

// export async function POST(req: NextRequest) {
//   try {
//     const data = await req.json();
//     const newWorkout = await createWorkout(data, 1); // Hard-coded userId for now
//     return NextResponse.json({ data: newWorkout }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Unknown error' },
//       { status: 500 },
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newWorkoutTemplate = await createWorkoutTemplate(data);
    return NextResponse.json({ data: newWorkoutTemplate }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
