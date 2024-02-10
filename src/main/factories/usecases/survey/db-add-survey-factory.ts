import { AddSurvey } from '@/domain/usecases/survey'
import { DbAddSurvey } from '@/data/usecases/survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
