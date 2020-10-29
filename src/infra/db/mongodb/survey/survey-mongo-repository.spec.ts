import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { AccountModel } from '@/domain/models/account'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

let surveyColletion: Collection
let surveyResultColletion: Collection
let accountColletion: Collection

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountColletion.insertOne(mockAddAccountParams())

  return MongoHelper.map(res.ops[0])
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      const surveyParams = mockAddSurveyParams()
      await sut.add(surveyParams)
      const survey = await surveyColletion.findOne({ question: surveyParams.question })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should loadAll surveys on success', async () => {
      const account = await mockAccount()
      const surveyParams = mockAddSurveyParams()
      const otherSurveyParams = mockAddSurveyParams()
      const result = await surveyColletion.insertMany([surveyParams, otherSurveyParams])
      const survey = result.ops[0]
      await surveyResultColletion.insertOne({
        surveyId: survey._id,
        accountId: account.id,
        aswer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(surveyParams.question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(otherSurveyParams.question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should loadAll empty list', async () => {
      const sut = makeSut()
      const account = await mockAccount()
      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const surveyParams = mockAddSurveyParams()
      const resp = await surveyColletion.insertOne(surveyParams)
      const sut = makeSut()
      const survey = await sut.loadById(resp.ops[0]._id)

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
