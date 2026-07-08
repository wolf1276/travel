'use client';

import imageCompression from 'browser-image-compression';
import { createClient } from '@/services/supabase/client';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'photos';

export interface UploadedImage {
  url: string;
  path: string;
  width: number;
  height: number;
}

function getImageDimensions(file: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not read image dimensions'));
    };
    image.src = objectUrl;
  });
}

/**
 * Compresses an image client-side, uploads it to the user's folder in the
 * Supabase Storage bucket, and returns the public URL + storage path (the
 * path is persisted so the object can be removed later on delete).
 */
export async function uploadImage(file: File, folder: string): Promise<UploadedImage> {
  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 2200,
    maxSizeMB: 2,
    useWebWorker: true,
    fileType: file.type,
  });

  const { width, height } = await getImageDimensions(compressed);

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    cacheControl: '3600',
    upsert: false,
    contentType: compressed.type,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { url: data.publicUrl, path, width, height };
}

export async function deleteImage(path: string) {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
