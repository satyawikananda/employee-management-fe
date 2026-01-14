
import { RawAxiosRequestHeaders } from 'axios';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';

export const headerAuth = async (
  customHeaders?: RawAxiosRequestHeaders,
  useToken: boolean = true,
) => {
  const isServer = typeof window === 'undefined';
  let headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  let user;

  if (!isServer) {
    const session = await getSession();
    user = session?.user;
  } else {
    if (useToken) {
      const { nextAuthConfig } = await import('@/configs/auth.config');
      const token = await getServerSession(nextAuthConfig);
      user = token?.user;
    }
  }

  if (user?.token && useToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${user.token}`,
    };
  }
  return headers;
};
