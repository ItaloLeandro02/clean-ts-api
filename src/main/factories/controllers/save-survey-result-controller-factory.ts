import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveyById, makeDbSaveSurveyResult } from '@/main/factories/usecases'
import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
