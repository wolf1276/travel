export interface CoupleMember {
  id: string;
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
}

export interface Couple {
  id: string;
  members: CoupleMember[];
}

export interface CoupleInvite {
  token: string;
  expiresAt: string;
  invitedBy: CoupleMember;
}
