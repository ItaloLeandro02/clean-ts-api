import faker from 'faker'
import { CompareFieldsValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('CompareField Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: faker.random.word(),
      fieldToCompare: faker.random.word()
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeed', () => {
    const sut = makeSut()
    const fieldValue = faker.random.word()
    const error = sut.validate({
      field: fieldValue,
      fieldToCompare: fieldValue
    })
    expect(error).toBeFalsy()
  })
})
