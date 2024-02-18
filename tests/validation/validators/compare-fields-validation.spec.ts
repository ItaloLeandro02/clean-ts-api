import { faker } from '@faker-js/faker'
import { CompareFieldsValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('CompareField Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: faker.lorem.word(),
      fieldToCompare: faker.lorem.word()
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeed', () => {
    const sut = makeSut()
    const fieldValue = faker.lorem.word()
    const error = sut.validate({
      field: fieldValue,
      fieldToCompare: fieldValue
    })
    expect(error).toBeFalsy()
  })
})
