import { Logo } from '@/components/common/Logo';
import { PageTransition } from '@/components/layout/PageTransition';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16 pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, hsl(var(--primary) / 0.16), transparent 70%)',
        }}
      />
      <div className="mb-8">
        <Logo href="/" />
      </div>
      <div className="w-full max-w-md">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
