import FakeObjectId from 'bson-objectid'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper, SurveyMongoRepository } from '@/infra/db/mongodb'
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountColletion: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountColletion.insertOne(mockAddAccountParams())
  return res.insertedId.toHexString()
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
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountColletion = MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      const surveyParams = mockAddSurveyParams()
      await sut.add(surveyParams)
      const survey = await surveyCollection.findOne({ question: surveyParams.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(accountId),
        aswer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()
      const surveys = await sut.loadAll(accountId)
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
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
      const resp = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.loadById(resp.insertedId.toHexString())
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return null survey not exists', async () => {
      const sut = makeSut()
      const survey = await sut.loadById(FakeObjectId().toHexString())
      expect(survey).toBeFalsy()
    })
  })

  describe('loadAnswers()', () => {
    test('Should load answers on success', async () => {
      const resp = await surveyCollection.insertOne(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ _id: resp.insertedId })
      const sut = makeSut()
      const answers = await sut.loadAnswers(survey._id.toHexString())
      expect(answers).toEqual([
        survey.answers[0].answer,
        survey.answers[1].answer,
        survey.answers[2].answer
      ])
    })

    test('Should return an empty array if survey not exists', async () => {
      const sut = makeSut()
      const answers = await sut.loadAnswers(FakeObjectId().toHexString())
      expect(answers).toEqual([])
    })
  })

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const resp = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const exists = await sut.checkById(resp.insertedId.toHexString())
      expect(exists).toBe(true)
    })

    test('Should return false if survey not exists', async () => {
      const sut = makeSut()
      const exists = await sut.checkById(FakeObjectId().toHexString())
      expect(exists).toBe(false)
    })
  })
})
