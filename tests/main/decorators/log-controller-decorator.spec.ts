import { faker } from '@faker-js/faker'
import { LogControllerDecorator } from '@/main/decorators'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { serverError, ok } from '@/presentation/helpers'
import { LogErrorRepository } from '@/data/protocols/db/log'
import { mockLogErrorRepository } from '@/tests/data/mocks'

class ControllerSPy implements Controller {
  request: any
  httpResponse = ok(faker.string.uuid())

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return await Promise.resolve(this.httpResponse)
  }
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSPy
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSPy()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositoryStub)
  return {
    sut,
    controllerSpy,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = faker.lorem.sentence()
    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(faker.lorem.sentence())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  test('Should call LogErrorRepository with correct errror if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError()))
    await sut.handle(faker.lorem.sentence())
    expect(logSpy).toBeCalledWith('any_stack')
  })
})
