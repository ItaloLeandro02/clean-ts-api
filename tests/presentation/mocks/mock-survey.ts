import { SurveyModel } from '@/domain/models'
import { AddSurvey, AddSurveyParams, LoadSurveyById, LoadSurveys } from '@/domain/usecases/survey'
import { mockSurveyModels, mockSurveyModel } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data
    return Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveysModels = mockSurveyModels()
  accountId

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return Promise.resolve(this.surveysModels)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyId: string
  survey = mockSurveyModel()

  async loadById (id: string): Promise<SurveyModel> {
    this.surveyId = id
    return Promise.resolve(this.survey)
  }
}
