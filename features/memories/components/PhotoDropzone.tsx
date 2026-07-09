'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MAX_PHOTOS_PER_VISIT } from '@/lib/constants';
import { deleteImage, uploadImage, type UploadedImage } from '@/services/supabase/storage';

export interface PendingPhoto extends UploadedImage {
  id: string;
}

export function PhotoDropzone({
  photos,
  onChange,
  favoriteIndex,
  onFavoriteChange,
  folder,
}: {
  photos: PendingPhoto[];
  onChange: (photos: PendingPhoto[]) => void;
  favoriteIndex: number | null;
  onFavoriteChange: (index: number | null) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList) {
    const remaining = MAX_PHOTOS_PER_VISIT - photos.length;
    if (remaining <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS_PER_VISIT} photos`);
      return;
    }

    const incoming = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remaining);
    if (incoming.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(
        incoming.map(async (file) => ({
          id: crypto.randomUUID(),
          ...(await uploadImage(file, folder)),
        })),
      );
      const next = [...photos, ...uploaded];
      onChange(next);
      if (favoriteIndex === null && next.length > 0) onFavoriteChange(0);
    } catch {
      toast.error('Some photos failed to upload.', {
        action: { label: 'Retry', onClick: () => void handleFiles(files) },
      });
    } finally {
      setIsUploading(false);
    }
  }

  function removePhoto(index: number) {
    const photo = photos[index];
    if (photo) void deleteImage(photo.path);

    const next = photos.filter((_, i) => i !== index);
    onChange(next);

    if (favoriteIndex === index) onFavoriteChange(next.length > 0 ? 0 : null);
    else if (favoriteIndex !== null && favoriteIndex > index) onFavoriteChange(favoriteIndex - 1);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (event.dataTransfer.files.length) void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/80 bg-card/40 px-6 py-8 text-center text-sm text-muted-foreground transition-colors',
          isDragging && 'border-primary bg-primary/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) void handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
        {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="font-medium text-primary hover:underline"
        >
          Choose photos
        </button>
        <span>or drag and drop — up to {MAX_PHOTOS_PER_VISIT} photos</span>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-border/70"
            >
              <Image src={photo.url} alt="" fill className="object-cover" />
              <div className="absolute inset-0 flex items-start justify-between bg-gradient-to-b from-black/40 via-transparent to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onFavoriteChange(index)}
                  aria-label="Set as favorite photo"
                  className={cn('rounded-full bg-black/50 p-1', favoriteIndex === index && 'text-amber-300')}
                >
                  <Star className={cn('h-3.5 w-3.5', favoriteIndex === index && 'fill-current')} />
                </button>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label="Remove photo"
                  className="rounded-full bg-black/50 p-1 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {favoriteIndex === index && (
                <div className="absolute bottom-1.5 left-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Favorite
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
