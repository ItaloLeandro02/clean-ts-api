import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { mockAddAccountParams } from '@/domain/test'

let accountColletion: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = await MongoHelper.getCollection('accounts')
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
