import { faker } from '@faker-js/faker'
import { SaveSurveyResult } from '@/domain/usecases'
import { SurveyResultModel } from '@/domain/models'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: faker.string.uuid(),
  surveyId: faker.string.uuid(),
  answer: faker.lorem.word(),
  date: faker.date.recent()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.lorem.words(),
  answers: [{
    answer: faker.lorem.word(),
    count: faker.number.int({ min: 0, max: 1000 }),
    percent: faker.number.int({ min: 0, max: 100 }),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }, {
    answer: faker.lorem.word(),
    image: faker.image.url(),
    count: faker.number.int({ min: 0, max: 1000 }),
    percent: faker.number.int({ min: 0, max: 100 }),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }],
  date: faker.date.recent()
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.lorem.words(),
  answers: [{
    answer: faker.lorem.word(),
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }, {
    answer: faker.lorem.word(),
    image: faker.image.url(),
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: faker.date.recent()
})
