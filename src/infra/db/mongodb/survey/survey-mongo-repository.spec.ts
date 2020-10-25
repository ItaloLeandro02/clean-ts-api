import { mockAddSurveyParams } from '@/domain/test'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyColletion: Collection

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
      const surveyParams = mockAddSurveyParams()
      const otherSurveyParams = mockAddSurveyParams()
      await surveyColletion.insertMany([surveyParams, otherSurveyParams])
      const sut = makeSut()
      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(surveyParams.question)
      expect(surveys[1].question).toBe(otherSurveyParams.question)
    })

    test('Should loadAll empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()

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
