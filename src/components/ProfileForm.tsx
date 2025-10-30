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
        <label className="text-gray-90 block text-sm/6 font-medium" htmlFor="avatar">
          Profile Picture
        </label>
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
          className="rounded-md border-1 border-blue-900 px-2 py-1 dark:border-white"
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-90 block text-sm/6 font-medium" htmlFor="name">
          Name
        </label>
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="text"
          id="name"
          name="name"
          defaultValue={user.name ?? ''}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-90 block text-sm/6 font-medium" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          id="bio"
          name="bio"
          defaultValue={profile?.bio ?? ''}
          maxLength={500}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-90 block text-sm/6 font-medium" htmlFor="height">
          Height
        </label>
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          type="number"
          id="height"
          name="height"
          defaultValue={profile?.height ?? undefined}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-90 block text-sm/6 font-medium" htmlFor="height">
          Weight
        </label>
        <input
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
