'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithSkeleton } from '@/components/common/ImageWithSkeleton';
import { uploadImage } from '@/services/supabase/storage';

export function AvatarUpload({
  value,
  onChange,
  folder,
  fallback,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  fallback: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setIsUploading(true);
    try {
      const uploaded = await uploadImage(file, folder);
      onChange(uploaded.url);
    } catch {
      toast.error('Could not upload photo.', {
        action: { label: 'Retry', onClick: () => void handleFile(file) },
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Change profile photo"
        className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-lg font-medium text-muted-foreground"
      >
        {value && <ImageWithSkeleton src={value} alt="Profile photo" fill className="object-cover" />}
        {!value && fallback}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
      </button>
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
      <div className="text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Profile photo</p>
        <p>PNG or JPG, up to a few MB.</p>
      </div>
    </div>
  );
}
