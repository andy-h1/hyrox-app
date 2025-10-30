'use client';
import Image from 'next/image';
import { useState } from 'react';
import { updateProfileAction } from '@/app/profile/actions';

type ProfileFormProps = {
  user: { name: string; id: string };
  profile: {
    bio?: string | null;
    height?: number | null;
    weight?: number | null;
    avatarUrl?: string | null;
  } | null;
};

export const ProfileForm = ({ user, profile }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await updateProfileAction(formData);
      alert('Profile updated!');
    } catch (error) {
      console.error(error);
      alert('Failed to upload profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex flex-col gap-1">
        <label htmlFor="avatar">Profile Picture</label>
        {profile?.avatarUrl && (
          <Image
            src={profile.avatarUrl}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
        <input
          className="rounded-md border-2 border-blue-900 dark:border-white"
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name">Name</label>
        <input
          className="rounded-md border-2 border-black dark:border-white"
          type="text"
          id="name"
          name="name"
          defaultValue={user.name ?? ''}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio">Bio</label>
        <textarea
          className="rounded-md border-2 border-black dark:border-white"
          id="bio"
          name="bio"
          defaultValue={profile?.bio ?? ''}
          maxLength={500}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="height">Height</label>
        <input
          className="rounded-md border-2 border-black dark:border-white"
          type="number"
          id="height"
          name="height"
          defaultValue={profile?.height ?? undefined}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="height">Weight</label>
        <input
          className="rounded-md border-2 border-black dark:border-white"
          type="number"
          id="weight"
          name="weight"
          step={0.1}
          defaultValue={profile?.weight ?? undefined}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};
