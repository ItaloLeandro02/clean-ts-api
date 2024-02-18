import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  const files = readdirSync(join(__dirname, '../routes'))
  for (const file of files) {
    if (!file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  }
}
