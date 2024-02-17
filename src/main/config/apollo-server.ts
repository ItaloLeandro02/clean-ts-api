import { ApolloServer } from 'apollo-server-express'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  resolvers,
  typeDefs
})