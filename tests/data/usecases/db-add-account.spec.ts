import { DbAddAccount } from '@/data/usecases'
import { HasherSpy, AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from '@/tests/data/mocks'
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  checkAccountByEmailRepositorySpy.result = null
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)
    expect(hasherSpy.plainText).toBe(accountParams.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)
    expect(addAccountRepositorySpy.addAccountData).toEqual({
      name: accountParams.name,
      email: accountParams.email,
      password: hasherSpy.digest
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const accountParams = mockAddAccountParams()
    const isValid = await sut.add(accountParams)
    expect(isValid).toBe(true)
  })

  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.result = false
    const accountParams = mockAddAccountParams()
    const isValid = await sut.add(accountParams)
    expect(isValid).toBe(false)
  })

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toBe(false)
  })

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)
    expect(accountParams.email).toBe(checkAccountByEmailRepositorySpy.email)
  })
})
