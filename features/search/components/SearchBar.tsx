'use client';

import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTags } from '@/hooks/useTags';
import type { PlaceStatus } from '@/types/place';

export function SearchBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  tag,
  onTagChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: PlaceStatus | 'ALL';
  onStatusChange: (value: PlaceStatus | 'ALL') => void;
  tag: string;
  onTagChange: (value: string) => void;
}) {
  const { data: tags } = useTags();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name, address, or tag"
          className="pl-9"
        />
      </div>

      <Select value={status} onValueChange={(value) => onStatusChange(value as PlaceStatus | 'ALL')}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All places</SelectItem>
          <SelectItem value="WANT_TO_VISIT">Planned</SelectItem>
          <SelectItem value="VISITED">Visited</SelectItem>
        </SelectContent>
      </Select>

      <Select value={tag || 'ALL'} onValueChange={(value) => onTagChange(value === 'ALL' ? '' : value)}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All tags</SelectItem>
          {(tags ?? []).map((existingTag) => (
            <SelectItem key={existingTag.id} value={existingTag.name}>
              {existingTag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
