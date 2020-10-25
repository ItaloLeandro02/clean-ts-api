import express from 'express'
import setupMiddlewares from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import setupSwagger from '@/main/config/config-swagger'
import setupStaticFiles from '@/main/config/static-files'

const app = express()
setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
