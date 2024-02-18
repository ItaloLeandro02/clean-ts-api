import { faker } from '@faker-js/faker'
import { DbLoadAccountByToken } from '@/data/usecases'
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

const token = faker.internet.password()
const role = faker.lorem.word()

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy, loadAccountByTokenRepositorySpy } = makeSut()
    await sut.load(token, role)
    expect(loadAccountByTokenRepositorySpy.token).toBe(decrypterSpy.ciphertext)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy, decrypterSpy } = makeSut()
    await sut.load(token, role)
    expect(loadAccountByTokenRepositorySpy.token).toBe(decrypterSpy.ciphertext)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.result = null
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy, decrypterSpy } = makeSut()
    const account = await sut.load(token, role)
    expect(loadAccountByTokenRepositorySpy.result).toEqual(account)
    expect(loadAccountByTokenRepositorySpy.token).toEqual(decrypterSpy.ciphertext)
    expect(loadAccountByTokenRepositorySpy.role).toEqual(role)
  })
})
