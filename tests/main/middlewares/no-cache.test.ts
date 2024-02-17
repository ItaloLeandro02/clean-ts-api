import request from 'supertest'
import { Express } from 'express'
import { setupApp } from '@/main/config/app'
import { noCache } from '@/main/middlewares'

let app: Express

describe('NoCache Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('Should disabled cache', async () => {
    app.get('/test_no_cache', noCache, (req, res) => res.send())

    await request(app)
      .get('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragman', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
