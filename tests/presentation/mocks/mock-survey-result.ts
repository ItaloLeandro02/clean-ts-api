import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult, SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultParams: SaveSurveyResultParams
  surveyResult = mockSurveyResultModel()

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.surveyResultParams = data
    return Promise.resolve(this.surveyResult)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResult = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.surveyResult)
  }
}
