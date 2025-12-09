'use client';
import Image from 'next/image';
import { useState } from 'react';
import { updateProfileAction } from '@/app/(authenticated)/profile/actions';
import { Field, Fieldset, Label } from './tailwind/fieldset';
import { Input } from './tailwind/input';
import { Textarea } from './tailwind/textarea';
import { Button } from './tailwind/button';

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
    <form onSubmit={handleSubmit}>
      <Fieldset className="flex flex-col gap-4">
        <Field className="justify-items-center">
          {profile?.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          )}

          <Input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
        </Field>

        <Field>
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" name="name" defaultValue={user.name ?? ''} />
        </Field>

        <Field>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" defaultValue={profile?.bio ?? ''} maxLength={500} />
        </Field>

        <Field>
          <Label htmlFor="height">Height</Label>
          <Input
            type="number"
            id="height"
            name="height"
            defaultValue={profile?.height ?? undefined}
          />
        </Field>

        <Field>
          <Label htmlFor="height">Weight</Label>
          <Input
            type="number"
            id="weight"
            name="weight"
            step={0.1}
            defaultValue={profile?.weight ?? undefined}
          />
        </Field>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </Fieldset>
    </form>
  );
};
