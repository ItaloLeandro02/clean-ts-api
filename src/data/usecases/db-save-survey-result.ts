import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { SaveSurveyResult } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(data)
    return await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
  }
}
