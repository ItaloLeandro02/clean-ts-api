import { Validation } from '@/presentation/protocols'

export class ValidationSpy implements Validation {
  inputParams: any

  validate (input: any): Error {
    this.inputParams = input

    return null
  }
}
