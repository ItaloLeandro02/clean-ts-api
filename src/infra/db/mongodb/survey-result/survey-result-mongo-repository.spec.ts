import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'

let surveyColletion: Collection
let surveyResultColletion: Collection
let accountColletion: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyColletion.insertOne(mockAddSurveyParams())

  return MongoHelper.map(res.ops[0])
}

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountColletion.insertOne(mockAddAccountParams())

  return MongoHelper.map(res.ops[0])
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyColletion = await MongoHelper.getCollection('surveys')
    await surveyColletion.deleteMany({})
    surveyResultColletion = await MongoHelper.getCollection('surveyResults')
    await surveyResultColletion.deleteMany({})
    accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const sut = makeSut()

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultColletion.findOne({
        surveyId: survey.id,
        accountId: account.id
      })

      expect(surveyResult).toBeTruthy()
    })

    test('Should update survey result if its not new', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()

      await surveyResultColletion.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultColletion
        .find({
          surveyId: survey.id,
          accountId: account.id
        })
        .toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()

      await surveyResultColletion.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const sut = makeSut()

      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })

    test('Should return null on if there is no survey result', async () => {
      const survey = await mockSurvey()

      const sut = makeSut()

      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeNull()
    })
  })
})
