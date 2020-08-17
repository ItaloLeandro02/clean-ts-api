import { Collection } from 'mongodb'
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

  return res.ops[0]
}

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountColletion.insertOne(mockAddAccountParams())

  return res.ops[0]
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
    test('Should add a survey result if its new ', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('Should update survey result if its not new ', async () => {
      const survey = await mockSurvey()
      const account = await mockAccount()
      const res = await surveyResultColletion.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(res.ops[0]._id)
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })
})
