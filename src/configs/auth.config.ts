import { authApi } from "@/lib/api/auth/auth.api";
import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

type UserCredResult = {
  id: string;
  email: string;
  name: string;
  accessToken: string;
};

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        try {
          const loginResult = await authApi.login(
            credentials?.email || '',
            credentials?.password || '',
          );
          return await Promise.resolve({
            id: loginResult.data.user.id,
            email: credentials?.email,
            name: loginResult.data.user.userName,
            accessToken: loginResult.data.accessToken,
          } as UserCredResult);
        } catch (error) {
          console.error(error);
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  logger: {
    error: (...message) => console.error(`[NEXT-AUTH ERROR] :: `, ...message),
    warn: (...message) => console.warn(`[NEXT-AUTH WARNING] :: `, ...message),
    debug: (...message) => console.debug(`[NEXT-AUTH DEBUG] :: `, ...message),
  },
  callbacks: {
    session(params) {
      const token = params.token as UserCredResult;
      const session = params.session as Session & UserCredResult;

      if (token?.id) {
        session.token = token.accessToken;
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          token: token.accessToken
        };
      }

      return session;
    },
    jwt(params) {
      const user = params.user as UserCredResult;
      if (user?.accessToken) {
        params.token = user;
        params.token.sub = user.id;
      }

      return params.token;
    },
  },
};
