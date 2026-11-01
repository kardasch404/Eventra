import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const getServerClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:4000/graphql',
      fetchOptions: { cache: 'no-store' },
    }),
  });
};
