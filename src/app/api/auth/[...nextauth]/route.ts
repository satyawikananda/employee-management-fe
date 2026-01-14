import { nextAuthConfig } from '@/configs/auth.config';
import NextAuth from 'next-auth';

const handler = NextAuth(nextAuthConfig);

export { handler as GET, handler as POST };
