import { DbAddAccount } from './db-add-asccount'

describe('DbAddAccount Usecase', () => {
  test('Should call encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accouuntData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.add(accouuntData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
