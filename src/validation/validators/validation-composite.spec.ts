import { ValidationComposite } from '@/validation/validators/validation-composite'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}
interface SutTypes {
  sut: ValidationComposite
  validationsStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationsStubs = [
    makeValidation(),
    makeValidation()
  ]
  const sut = new ValidationComposite(validationsStubs)

  return {
    sut,
    validationsStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationsStubs } = makeSut()

    jest.spyOn(validationsStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationsStubs } = makeSut()

    jest.spyOn(validationsStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationsStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeed', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
