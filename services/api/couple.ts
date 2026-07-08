import { apiFetch } from '@/services/api/http';
import type { Couple, CoupleInvite } from '@/types/couple';

export const coupleApi = {
  get() {
    return apiFetch<{ couple: Couple }>('/api/couple').then((r) => r.couple);
  },
  getInvite() {
    return apiFetch<{ invite: CoupleInvite | null }>('/api/couple/invites').then((r) => r.invite);
  },
  createInvite() {
    return apiFetch<{ invite: CoupleInvite }>('/api/couple/invites', { method: 'POST' }).then(
      (r) => r.invite,
    );
  },
  acceptInvite(token: string) {
    return apiFetch<{ couple: Couple }>(`/api/couple/invites/${token}/accept`, {
      method: 'POST',
    }).then((r) => r.couple);
  },
};
