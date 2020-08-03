import { makeSignUpValidation } from '@/main/factories/controllers/login/signup/signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecasses/account/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecasses/account/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())

  return makeLogControllerDecorator(controller)
}
