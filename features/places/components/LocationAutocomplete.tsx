'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  useLocationSearch,
  fetchPlaceDetails,
  type LocationSuggestion,
} from '@/hooks/useLocationSearch';

export function LocationAutocomplete({
  defaultQuery,
  onSelect,
  id,
}: {
  defaultQuery?: string;
  onSelect: (suggestion: LocationSuggestion) => void;
  id?: string;
}) {
  const [query, setQuery] = useState(defaultQuery ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, isLoading, hasToken } = useLocationSearch(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handlePick(placeId: string, fallbackName: string) {
    setIsOpen(false);
    setIsResolving(true);
    const details = await fetchPlaceDetails(placeId);
    setIsResolving(false);

    if (!details) return;
    onSelect(details);
    setQuery(details.name || fallbackName);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search a place... (cafe, beach, viewpoint, museum...)"
          aria-label="Search a place"
          role="combobox"
          aria-expanded={isOpen && hasToken && results.length > 0}
          aria-autocomplete="list"
          className="pl-9"
        />
        {(isLoading || isResolving) && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && hasToken && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border/70 bg-popover shadow-elevated">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => void handlePick(result.id, result.name)}
              className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-accent"
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block truncate font-medium">{result.name}</span>
                {result.address && (
                  <span className="block truncate text-xs text-muted-foreground">{result.address}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {!hasToken && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Add a Google Maps API key to enable place search — for now, enter the place manually below.
        </p>
      )}
    </div>
  );
}
