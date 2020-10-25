import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepositorySpy } from '@/data/test'
import { throwError, mockSurveyModel } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()

  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    await sut.loadById(surveyModel.id)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyModel.id)
  })

  test('Should return a Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    const survey = await sut.loadById(surveyModel.id)
    expect(loadSurveyByIdRepositorySpy.surveyModel).toEqual(survey)
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const surveyModel = mockSurveyModel()
    const promise = sut.loadById(surveyModel.id)
    await expect(promise).rejects.toThrow()
  })
})
