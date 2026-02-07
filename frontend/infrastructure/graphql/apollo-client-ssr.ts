import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const getServerClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
      fetchOptions: { cache: 'no-store' },
    }),
  });
};
