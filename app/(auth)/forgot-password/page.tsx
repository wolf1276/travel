import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password — Travel Memories',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
