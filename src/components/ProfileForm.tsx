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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
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
        <input className="rounded-md" type="file" id="avatar" name="avatar" accept="image/*" />
      </div>

      <div>
        <label htmlFor="name">Name</label>
        <input
          className="rounded-md"
          type="text"
          id="name"
          name="name"
          defaultValue={user.name ?? ''}
        />
      </div>

      <div>
        <label htmlFor="bio">Bio</label>
        <textarea
          className="rounded-md"
          id="bio"
          name="bio"
          defaultValue={profile?.bio ?? ''}
          maxLength={500}
        />
      </div>

      <div>
        <label htmlFor="height">Height</label>
        <input
          className="rounded-md"
          type="number"
          id="height"
          name="height"
          defaultValue={profile?.height ?? undefined}
        />
      </div>

      <div>
        <label htmlFor="height">Weight</label>
        <input
          className="rounded-md"
          type="number"
          id="Weight"
          name="weight"
          defaultValue={profile?.weight ?? undefined}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};
