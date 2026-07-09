'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTags } from '@/hooks/useTags';

export function TagsInput({
  value,
  onChange,
  max = 10,
  id,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  id?: string;
}) {
  const [draft, setDraft] = useState('');
  const { data: existingTags } = useTags();

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag || value.length >= max) return;
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...value, tag]);
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
  }

  const suggestions = (existingTags ?? [])
    .map((tag) => tag.name)
    .filter(
      (name) =>
        draft.length > 0 &&
        !value.includes(name) &&
        name.toLowerCase().includes(draft.toLowerCase()),
    )
    .slice(0, 5);

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              addTag(draft);
            } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
              removeTag(value[value.length - 1]!);
            }
          }}
          placeholder={value.length >= max ? `Up to ${max} tags` : 'Add a tag and press Enter'}
          disabled={value.length >= max}
        />
        {suggestions.length > 0 && (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-border/70 bg-popover shadow-elevated">
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => addTag(name)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
