import { makeLoginValidation } from '@/main/factories/controllers/login/login/login-validation-factory'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@/validation/validators'
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

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorSpy()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
