import { AddSurvey, CheckSurveyById, LoadSurveyById, LoadSurveys } from '@/domain/usecases'
import { mockSurveyModels, mockSurveyModel } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveysModels = mockSurveyModels()
  accountId

  async load (accountId: string): Promise<LoadSurveys.Result> {
    this.accountId = accountId
    return Promise.resolve(this.surveysModels)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyId: string
  survey = mockSurveyModel()

  async loadById (id: string): Promise<LoadSurveyById.Result> {
    this.surveyId = id
    return Promise.resolve(this.survey)
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  surveyId: string

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.surveyId = id
    return Promise.resolve(this.result)
  }
}
