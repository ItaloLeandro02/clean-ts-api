import { faker } from '@faker-js/faker'
import { EmailValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidatorSpy } from '@/tests/validation/mocks'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.emailIsValid = false
    const error = sut.validate({ email: faker.internet.email() })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()
    sut.validate({ email })
    expect(emailValidatorSpy.emailParam).toBe(email)
  })

  test('Should throw if EmailValidator throws', () => {
    const { emailValidatorSpy, sut } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => {
      sut.validate(faker.internet.email())
    }).toThrow()
  })
})
