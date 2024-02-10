import { LoadSurveys } from '@/domain/usecases/survey'
import { SurveyModel } from '@/domain/models'
import { LoadSurveysRepository } from '@/data/protocols/db/survey'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (accountId: string): Promise<SurveyModel[]> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }
}
