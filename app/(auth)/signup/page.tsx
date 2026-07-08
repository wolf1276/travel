import type { Metadata } from 'next';
import { SignupForm } from '@/features/auth/components/SignupForm';

export const metadata: Metadata = {
  title: 'Sign up — Travel Memories',
};

export default function SignupPage() {
  return <SignupForm />;
}
