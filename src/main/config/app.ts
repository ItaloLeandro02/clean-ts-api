import express, { Express } from 'express'
import setupStaticFiles from '@/main/config/static-files'
import setupSwagger from '@/main/config/swagger'
import setupMiddlewares from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import { setupApolloServer } from '@/main/config/apollo-server'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddlewares(app)
  await setupRoutes(app)
  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })
  return app
}
