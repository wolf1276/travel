'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function ImageWithSkeleton({ className, alt, onLoad, onError, ...props }: ImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <>
      {status !== 'loaded' && <Skeleton className="absolute inset-0 rounded-none" />}
      {status !== 'error' && (
        <Image
          {...props}
          alt={alt}
          className={cn(className, 'transition-opacity duration-300', status === 'loaded' ? 'opacity-100' : 'opacity-0')}
          onLoad={(event) => {
            setStatus('loaded');
            onLoad?.(event);
          }}
          onError={(event) => {
            setStatus('error');
            onError?.(event);
          }}
        />
      )}
    </>
  );
}
