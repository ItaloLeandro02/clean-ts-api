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

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    test('Should return SurveyResult on success', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      const surveyRes = await surveyColletion.insertOne({
        question: 'Question 1',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })
      const query = `query {
            surveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
                question
                answers {
                    answer
                    count
                    percent
                    isCurrentAccountAnswer
                }
                date
            }
        }`
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe('Question 1')
      expect(res.body.data.surveyResult.date).toBe(now.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyColletion.insertOne({
        question: 'Question 1',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      const query = `query {
              surveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
                  question
                  answers {
                      answer
                      count
                      percent
                      isCurrentAccountAnswer
                  }
                  date
              }
          }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    test('Should return SurveyResult on success', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      const surveyRes = await surveyColletion.insertOne({
        question: 'Question 1',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })
      const query = `mutation {
            saveSurveyResult (surveyId: "${surveyRes.insertedId.toHexString()}", answer: "Answer 2") {
                question
                answers {
                    answer
                    count
                    percent
                    isCurrentAccountAnswer
                }
                date
            }
        }`
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe('Question 1')
      expect(res.body.data.saveSurveyResult.date).toBe(now.toISOString())
      expect(res.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer 2',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })
  })
})
