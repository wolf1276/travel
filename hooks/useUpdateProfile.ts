'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { profileApi } from '@/services/api/profile';
import type { ProfileFormInput } from '@/lib/validations/profile.schema';

export function useUpdateProfile() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: ProfileFormInput) => profileApi.update(input),
    onSuccess: () => {
      router.refresh();
    },
  });
}
