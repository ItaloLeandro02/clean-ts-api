import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb'
import { mockAddAccountParams } from '@/tests/domain/mocks'

let accountColletion: Collection
let app: Express

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('POST / signup', () => {
    test('Should return 200 on signup', async () => {
      const accountParams = mockAddAccountParams()
      await request(app)
        .post('/api/signup')
        .send({
          ...accountParams,
          passwordConfirmation: accountParams.password
        })
        .expect(200)
    })
  })

  describe('POST / login', () => {
    test('Should return 200 on login', async () => {
      const accountParams = mockAddAccountParams()
      const password = await hash(accountParams.password, 12)
      await accountColletion.insertOne({
        ...accountParams,
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: accountParams.email,
          password: accountParams.password
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      const accountParams = mockAddAccountParams()
      await request(app)
        .post('/api/login')
        .send({
          email: accountParams.email,
          password: accountParams.password
        })
        .expect(401)
    })
  })
})
