import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result'
import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
