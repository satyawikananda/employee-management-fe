'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 60 * 1000,
      },
    },
    queryCache: new QueryCache({
      onSuccess: (query) => {
        return query;
      },
      onError: (error) => {
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
          console.log(`🚫 Query error: `, {
            message: error?.message,
            stack: error?.stack,
          });
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {

          console.log(`🚫 Mutation error: `, {
            message: error?.message,
            stack: error?.stack,
          });
        }
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
