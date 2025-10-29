'use server';

import { getServerSession } from '@/lib/auth-server';
import { updateUserProfile } from '@/lib/database/appUser';
import { profileSchema } from '@/lib/validations/profile';

export const updateProfileAction = async (formData: FormData) => {
  const session = await getServerSession();

  if (!session?.user.id) throw new Error('Unauthorised');
  const parsed = profileSchema.parse(formData);
  return updateUserProfile(session?.user.id, parsed);
};
