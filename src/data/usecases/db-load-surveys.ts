import { LoadSurveys } from '@/domain/usecases'
import { LoadSurveysRepository } from '@/data/protocols/db/survey'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (accountId: string): Promise<LoadSurveys.Result> {
    return await this.loadSurveysRepository.loadAll(accountId)
  }
}
