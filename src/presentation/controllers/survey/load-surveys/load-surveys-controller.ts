import { Controller, HttpRequest, HttpResponse } from './load-surveys-controller-protocols'
import { LoadSurveys } from '../../../../domain/usecases/load-surveys'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return null
  }
}
