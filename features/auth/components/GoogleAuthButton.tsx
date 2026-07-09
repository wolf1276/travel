'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createClient } from '@/services/supabase/client';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.29 1.48-1.14 2.73-2.43 3.58v2.98h3.93c2.3-2.12 3.55-5.24 3.55-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.93-2.98c-1.09.73-2.5 1.16-4 1.16-3.08 0-5.68-2.08-6.61-4.87H1.36v3.06C3.33 21.3 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.39 14.4c-.24-.73-.38-1.5-.38-2.4s.14-1.67.38-2.4V6.54H1.36A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.36 5.46l4.03-3.06z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.36 0 3.33 2.7 1.36 6.54l4.03 3.06C6.32 6.85 8.92 4.77 12 4.77z"
      />
    </svg>
  );
}

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  async function handleClick() {
    setIsLoading(true);
    const supabase = createClient();
    const next = searchParams.get('next');
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (next) callbackUrl.searchParams.set('next', next);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
      Continue with Google
    </Button>
  );
}
