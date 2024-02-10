import { makeSignUpValidation } from '@/main/factories/controllers'
import { makeDbAddAccount, makeDbAuthentication } from '@/main/factories/usecases/account'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
