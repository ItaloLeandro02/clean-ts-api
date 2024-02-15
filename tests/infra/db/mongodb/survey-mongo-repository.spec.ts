import { Collection } from 'mongodb'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyColletion: Collection
let surveyResultColletion: Collection
let accountColletion: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountColletion.insertOne(mockAddAccountParams())
  return res.ops[0]._id
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
      const accountId = await mockAccountId()
      const surveyParams = mockAddSurveyParams()
      const otherSurveyParams = mockAddSurveyParams()
      const result = await surveyColletion.insertMany([surveyParams, otherSurveyParams])
      const survey = result.ops[0]
      await surveyResultColletion.insertOne({
        surveyId: survey._id,
        accountId: accountId,
        aswer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(surveyParams.question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(otherSurveyParams.question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should loadAll empty list', async () => {
      const sut = makeSut()
      const accountId = await mockAccountId()
      const surveys = await sut.loadAll(accountId)
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
