import MockDate from 'mockdate'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test'
import { mockSurveyModel, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()

  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    const surveyResult = await sut.load(surveyModel.id)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyModel.id)
    expect(loadSurveyResultRepositorySpy.surveyResultModel).toBe(surveyResult)
  })

  test('Should return a SurveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    const surveyResult = await sut.load(surveyModel.id)
    expect(loadSurveyResultRepositorySpy.surveyId).toEqual(surveyModel.id)
    expect(loadSurveyResultRepositorySpy.surveyResultModel).toEqual(surveyResult)
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null
    const surveyModel = mockSurveyModel()
    await sut.load(surveyModel.id)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyModel.id)
  })

  test('Should return SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    const surveyResult = await sut.load(surveyModel.id)
    expect(loadSurveyResultRepositorySpy.surveyId).toEqual(surveyModel.id)
    expect(loadSurveyResultRepositorySpy.surveyResultModel).toEqual(surveyResult)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })
})
