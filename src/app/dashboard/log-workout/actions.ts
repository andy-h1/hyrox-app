'use server';

import { createWorkoutLog } from '@/lib/database/workout-logs';
import { getCurrentUser } from '@/lib/auth-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveWorkoutAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorised');

  const templateId = Number(formData.get('templateId'));
  const lapsJson = formData.get('laps') as string;
  const laps = JSON.parse(lapsJson);

  await createWorkoutLog({
    userId: user.id,
    templateId,
    laps,
  });

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
