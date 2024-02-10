import { LoadSurveyById } from '@/domain/usecases/survey'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
