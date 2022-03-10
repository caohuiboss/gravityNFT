import ApolloClient from 'apollo-boost';

const fleekApiKey = 'GiYTM25aBWBMCa673NYLR2aiMmdID4aTkL2AKGZJFqk=';
export const client = new ApolloClient({
  uri: 'https://api.fleek.co/graphql',
  fetch: fetch,
  headers: {
    authorization: fleekApiKey,
  },
});
