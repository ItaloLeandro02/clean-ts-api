import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result'
import { Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())
  return makeLogControllerDecorator(controller)
}
