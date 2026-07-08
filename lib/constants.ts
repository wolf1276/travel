import { LayoutGrid, Map as MapIcon, Search, UserRound } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/map', label: 'Map', icon: MapIcon },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'Profile', icon: UserRound },
] as const;

export const MAX_PHOTO_UPLOAD_SIZE_MB = 8;
export const MAX_PHOTOS_PER_VISIT = 30;
export const PLACES_PAGE_SIZE = 12;

export const RATING_MIN = 1;
export const RATING_MAX = 5;
