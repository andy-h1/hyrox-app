import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const uploadAvatar = async (file: File, userId: string) => {
  {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage.from('profiles').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('profiles').getPublicUrl(filePath);

    return publicUrl;
  }
};
