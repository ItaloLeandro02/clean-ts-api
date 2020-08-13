import { Collection } from 'mongodb'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let surveyColletion: Collection
let surveyResultColletion: Collection
let accountColletion: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyColletion.insertOne({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  return res.ops[0]
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountColletion.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
  })

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
      const survey = await makeSurvey()
      const account = await makeAccount()
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
  })
})
