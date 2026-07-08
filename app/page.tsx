import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';

export default async function RootPage() {
  const user = await getServerUser();
  redirect(user ? '/dashboard' : '/login');
}
