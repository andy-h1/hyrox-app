import { NextResponse } from "next/server";
import { getExercises } from "@/lib/database/exercises";

export async function GET() {

    const allExercises = await getExercises();

    return NextResponse.json({ data:allExercises },{ status: 200 });
}