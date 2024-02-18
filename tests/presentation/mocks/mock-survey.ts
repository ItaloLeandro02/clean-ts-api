import { faker } from '@faker-js/faker'
import { AddSurvey, CheckSurveyById, LoadAnswersBySurvey, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModels } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    await Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveysModels = mockSurveyModels()
  accountId

  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return await Promise.resolve(this.surveysModels)
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [faker.lorem.word(), faker.lorem.word()]
  surveyId: string

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    this.surveyId = id
    return await Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  surveyId: string

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.surveyId = id
    return await Promise.resolve(this.result)
  }
}
