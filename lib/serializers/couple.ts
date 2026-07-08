import type { Couple as PrismaCouple, CoupleInvite as PrismaCoupleInvite, User } from '@prisma/client';
import type { Couple, CoupleInvite, CoupleMember } from '@/types/couple';

function serializeMember(user: User): CoupleMember {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
}

export function serializeCouple(couple: PrismaCouple & { members: User[] }): Couple {
  return {
    id: couple.id,
    members: couple.members.map(serializeMember),
  };
}

export function serializeCoupleInvite(invite: PrismaCoupleInvite & { invitedBy: User }): CoupleInvite {
  return {
    token: invite.token,
    expiresAt: invite.expiresAt.toISOString(),
    invitedBy: serializeMember(invite.invitedBy),
  };
}
