import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { mockSurveyResultModel } from '@/domain/test'

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
