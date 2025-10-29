'use server';

import { getServerSession } from '@/lib/auth-server';
import { updateUserProfile } from '@/lib/database/appUser';
import { uploadAvatar } from '@/lib/storage';
import { profileSchema } from '@/lib/validations/profile';

export const updateProfileAction = async (formData: FormData) => {
  const session = await getServerSession();

  if (!session?.user.id) throw new Error('Unauthorised');

  let avatarUrl;
  const file = formData.get('avatar') as File;
  if (file?.size > 0) {
    avatarUrl = await uploadAvatar(file, session.user.id);
  }

  const data = {
    name: formData.get('name') as string,
    bio: formData.get('bio') as string,
    height: formData.get('height') ? Number(formData.get('height')) : undefined,
    weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
    avatarUrl,
  };

  const validated = profileSchema.parse(data);
  return updateUserProfile(Number(session.user.id), validated);
};
