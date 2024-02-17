import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result = mockSurveyResultModel()
  surveyResultParams: SaveSurveyResult.Params

  async save (data: SaveSurveyResult.Params): Promise<SurveyResultModel> {
    this.surveyResultParams = data
    return Promise.resolve(this.result)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return Promise.resolve(this.result)
  }
}
