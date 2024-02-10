import faker from 'faker'
import { RequiredFieldValidation } from '@/validation/validators'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}
describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: faker.name.findName() })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeed', () => {
    const sut = makeSut()
    const error = sut.validate({ field: faker.name.findName() })
    expect(error).toBeFalsy()
  })
})
