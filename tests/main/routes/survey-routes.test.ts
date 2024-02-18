import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyCollection: Collection
let accountColletion: Collection
let app: Express

const makeAccessToken = async (role?: string): Promise<string> => {
  const accountParams = mockAddAccountParams()
  const res = await accountColletion.insertOne({
    ...accountParams,
    role
  })
  const id = res.insertedId
  const accessToken = sign({ id }, env.jwtSecret)
  await accountColletion.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountColletion = MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountColletion.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      const surveyParams = mockAddSurveyParams()
      await request(app)
        .post('/api/surveys')
        .send(surveyParams)
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')
      const surveyParams = mockAddSurveyParams()
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(surveyParams)
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
