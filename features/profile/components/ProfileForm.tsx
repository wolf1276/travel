'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AvatarUpload } from '@/features/profile/components/AvatarUpload';
import { profileSchema, type ProfileFormInput } from '@/lib/validations/profile.schema';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import type { UserProfile } from '@/types/user';

export function ProfileForm({ user }: { user: UserProfile }) {
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user.displayName ?? '',
      bio: user.bio ?? '',
      avatarUrl: user.avatarUrl,
    },
  });

  async function onSubmit(values: ProfileFormInput) {
    try {
      await updateProfile.mutateAsync(values);
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update your profile.', {
        action: { label: 'Retry', onClick: () => void onSubmit(values) },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarUpload
                  value={field.value ?? null}
                  onChange={field.onChange}
                  folder={`${user.id}/profile`}
                  fallback={(user.displayName ?? user.email)[0]?.toUpperCase() ?? '?'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={user.email} disabled />
        </div>

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="A little about your travels" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
