import { apiFetch } from '@/services/api/http';
import type { ProfileFormInput } from '@/lib/validations/profile.schema';
import type { UserProfile } from '@/types/user';

export const profileApi = {
  update(input: ProfileFormInput) {
    return apiFetch<{ user: UserProfile }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(input),
    }).then((r) => r.user);
  },
};
