'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/features/search/components/SearchBar';
import { SearchResults } from '@/features/search/components/SearchResults';
import type { PlaceStatus } from '@/types/place';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PlaceStatus | 'ALL'>('ALL');
  const [tag, setTag] = useState('');

  const debouncedQuery = useDebounce(query, 300);
  const isActive = Boolean(debouncedQuery.trim() || status !== 'ALL' || tag);

  const { data: places, isLoading } = useSearch({
    q: debouncedQuery.trim() || undefined,
    status: status === 'ALL' ? undefined : status,
    tag: tag || undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Search</h1>
        <p className="text-sm text-muted-foreground">Find any place in your scrapbook.</p>
      </div>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        tag={tag}
        onTagChange={setTag}
      />
      <SearchResults places={places} isLoading={isLoading} isActive={isActive} />
    </div>
  );
}
