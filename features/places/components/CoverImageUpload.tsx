'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { cn } from '@/lib/utils';
import { deleteImage, uploadImage } from '@/services/supabase/storage';

interface CoverImageValue {
  url: string;
  path: string;
}

export function CoverImageUpload({
  value,
  onChange,
  folder,
}: {
  value: CoverImageValue | null;
  onChange: (value: CoverImageValue | null) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setIsUploading(true);
    try {
      const uploaded = await uploadImage(file, folder);
      const previous = value;
      onChange({ url: uploaded.url, path: uploaded.path });
      if (previous) void deleteImage(previous.path);
    } catch {
      toast.error('Could not upload image.', {
        action: { label: 'Retry', onClick: () => void handleFile(file) },
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    if (value) void deleteImage(value.path);
    onChange(null);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) void handleFile(file);
      }}
      className={cn(
        'relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-border/80 bg-card/40 transition-colors',
        isDragging && 'border-primary bg-primary/5',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = '';
        }}
      />

      {value ? (
        <>
          <ImageWithSkeleton src={value.url} alt="Cover" fill className="object-cover" />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={handleRemove}
            className="absolute right-3 top-3 h-8 w-8 rounded-full shadow-elevated"
            aria-label="Remove cover image"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          <span>{isUploading ? 'Uploading…' : 'Click or drag a cover image here'}</span>
        </button>
      )}
    </div>
  );
}
