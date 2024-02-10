import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyColletion: Collection
let accountColletion: Collection

const makeAccessToken = async (role?: string): Promise<string> => {
  const accountParams = mockAddAccountParams()
  const res = await accountColletion.insertOne({
    ...accountParams,
    role
  })
  const id = res.ops[0]._id
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
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getCollection('surveys')
    accountColletion = await MongoHelper.getCollection('accounts')
    await surveyColletion.deleteMany({})
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
