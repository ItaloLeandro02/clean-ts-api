import { faker } from '@faker-js/faker'
import { Collection } from 'mongodb'
import { AccountMongoRepository, MongoHelper } from '@/infra/db/mongodb'
import { mockAddAccountParams } from '@/tests/domain/mocks'

let accountColletion: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return true on add success', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      const isValid = await sut.add(accountParams)
      expect(isValid).toBe(true)
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      await accountColletion.insertOne(accountParams)
      const account = await sut.loadByEmail(accountParams.email)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountParams.name)
      expect(account.password).toBe(accountParams.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail(faker.internet.email())
      expect(account).toBeFalsy()
    })
  })

  describe('checkByEmail()', () => {
    test('Should return true if email is valid', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      await accountColletion.insertOne(accountParams)
      const exists = await sut.checkByEmail(accountParams.email)
      expect(exists).toBe(true)
    })

    test('Should return false if email is not valid', async () => {
      const sut = makeSut()
      const exists = await sut.checkByEmail(faker.internet.email())
      expect(exists).toBe(false)
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountColletion.insertOne(mockAddAccountParams())
      const fakeAccount = await accountColletion.findOne({ _id: res.insertedId })
      expect(fakeAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount._id.toString(), 'any_token')
      const account = await accountColletion.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role success', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      await accountColletion.insertOne({
        name: accountParams.name,
        email: accountParams.email,
        password: accountParams.password,
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      await accountColletion.insertOne({
        name: accountParams.name,
        email: accountParams.email,
        password: accountParams.password,
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      await accountColletion.insertOne({
        name: accountParams.name,
        email: accountParams.email,
        password: accountParams.password,
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      await accountColletion.insertOne({
        name: accountParams.name,
        email: accountParams.email,
        password: accountParams.password,
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeFalsy()
    })
  })
})
