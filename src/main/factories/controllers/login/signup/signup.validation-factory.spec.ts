import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory'
import { ValidationComposite, CompareFieldsValidation, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { Validation } from '@/presentation/protocols/validation'

jest.mock('@/validation/validators/validation-composite')

class EmailValidatorSpy implements EmailValidator {
  email: string

  isValid (email: string): boolean {
    this.email = email

    return true
  }
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorSpy()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
