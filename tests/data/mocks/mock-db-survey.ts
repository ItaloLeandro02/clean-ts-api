import { faker } from '@faker-js/faker'
import { AddSurveyRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols/db/survey'
import { AddSurvey } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  data: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.data = data
    await Promise.resolve()
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  result = [faker.lorem.word(), faker.lorem.word()]
  id: string

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return await Promise.resolve(this.result)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  result = mockSurveyModels()
  accountId: string

  async loadAll (accountId: string): Promise<LoadSurveysRepository.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.result)
  }
}
