import { faker } from '@faker-js/faker'
import validator from 'validator'
import { EmailValidatorAdapter } from '@/infra/validators'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    expect(sut.isValid('invalid_email@email.com')).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    expect(sut.isValid('valid_email@email.com')).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const email = faker.internet.email()
    sut.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})
