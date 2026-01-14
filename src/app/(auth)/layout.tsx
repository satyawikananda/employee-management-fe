import { nextAuthConfig } from '@/configs/auth.config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthConfig);

  if (session) {
    redirect('/');
  }

  return children;
}

export default AuthLayout;
