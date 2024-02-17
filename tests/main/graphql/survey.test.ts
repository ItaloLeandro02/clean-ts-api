import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb'
import { mockAddAccountParams } from '@/tests/domain/mocks'

let surveyColletion: Collection
let accountColletion: Collection
let app: Express

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

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
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

  describe('Survey Query', () => {
    const query = `query {
        surveys {
            id
            question
            answers {
                image
                answer
            }
            date
            didAnswer
        }
    }`

    test('Should return Surveys on success', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      await surveyColletion.insertOne({
        question: 'Question 1',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe('Question 1')
      expect(res.body.data.surveys[0].date).toBe(now.toISOString())
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
      expect(res.body.data.surveys[0].answers).toEqual([{
        image: 'http://image-name.com',
        answer: 'Answer 1'
      }, {
        image: null,
        answer: 'Answer 2'
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()
      await surveyColletion.insertOne({
        question: 'Question 1',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })
})
