import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { MissingParamError, ServerError, EmailInUseError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { AuthenticationSpy, ValidationSpy, AddAccountSpy } from '@/presentation/test'
import { throwError, mockAddAccountParams } from '@/domain/test'

const mockRequest = (): HttpRequest => {
  const accountParams = mockAddAccountParams()
  return {
    body: {
      ...accountParams,
      passwordConfirmation: accountParams.password
    }
  }
}

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()

  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)

  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('Signup Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { addAccountSpy, sut } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(addAccountSpy.params.name).toEqual(httpRequest.body.name)
    expect(addAccountSpy.params.email).toEqual(httpRequest.body.email)
    expect(addAccountSpy.params.password).toEqual(httpRequest.body.password)
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.account = null
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('Should return 400 if valid returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authenthication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(authenticationSpy.authentication.email).toEqual(httpRequest.body.email)
    expect(authenticationSpy.authentication.password).toEqual(httpRequest.body.password)
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
