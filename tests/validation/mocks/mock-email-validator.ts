import { EmailValidator } from '@/validation/protocols'

export class EmailValidatorSpy implements EmailValidator {
  emailParam: string
  emailIsValid: boolean = true

  isValid (email: string): boolean {
    this.emailParam = email
    return this.emailIsValid
  }
}
