import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { LoadSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError, mockSurveyModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadAnswersBySurvey', () => {
  test('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    await sut.loadAnswers(surveyModel.id)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyModel.id)
  })

  test('Should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const surveyModel = mockSurveyModel()
    const answers = await sut.loadAnswers(surveyModel.id)
    expect(answers).toEqual([
      loadSurveyByIdRepositorySpy.result.answers[0].answer,
      loadSurveyByIdRepositorySpy.result.answers[1].answer
    ])
  })

  test('Should return an empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null
    const surveyModel = mockSurveyModel()
    const answers = await sut.loadAnswers(surveyModel.id)
    expect(answers).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError)
    const surveyModel = mockSurveyModel()
    const promise = sut.loadAnswers(surveyModel.id)
    await expect(promise).rejects.toThrow()
  })
})
