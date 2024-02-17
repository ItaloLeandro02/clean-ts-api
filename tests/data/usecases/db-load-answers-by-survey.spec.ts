import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks'
import { throwError, mockSurveyModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)
  return {
    sut,
    loadAnswersBySurveyRepositorySpy
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('Should call LoadAnswersBySurveyRepository with correct values', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    await sut.loadAnswers(surveyModel.id)
    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyModel.id)
  })

  test('Should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    const answers = await sut.loadAnswers(surveyModel.id)
    expect(answers).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1]
    ])
  })

  test('Should return an empty array if LoadAnswersBySurveyRepository returns an empty array', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []
    const surveyModel = mockSurveyModel()
    const answers = await sut.loadAnswers(surveyModel.id)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const surveyModel = mockSurveyModel()
    const promise = sut.loadAnswers(surveyModel.id)
    await expect(promise).rejects.toThrow()
  })
})
