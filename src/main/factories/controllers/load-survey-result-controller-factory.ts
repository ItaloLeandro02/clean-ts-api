import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'
import { Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}
