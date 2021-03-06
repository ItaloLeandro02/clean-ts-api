import faker from 'faker'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { ValidationSpy } from '@/validation/test'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

type SutTypes = {
  sut: ValidationComposite
  validationsSpy: Validation[]
}

const makeSut = (): SutTypes => {
  const validationsSpy = [
    new ValidationSpy(),
    new ValidationSpy()
  ]
  const sut = new ValidationComposite(validationsSpy)

  return {
    sut,
    validationsSpy
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationsSpy } = makeSut()
    jest.spyOn(validationsSpy[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: faker.random.word() })

    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationsSpy } = makeSut()
    jest.spyOn(validationsSpy[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationsSpy[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: faker.random.word() })

    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeed', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: faker.random.word() })

    expect(error).toBeFalsy()
  })
})
