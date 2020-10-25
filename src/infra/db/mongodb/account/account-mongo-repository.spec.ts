import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { mockAddAccountParams } from '@/domain/test'

let accountColletion: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      const account = await sut.add(accountParams)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(accountParams.name)
      expect(account.email).toBe(accountParams.email)
      expect(account.password).toBe(accountParams.password)
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
      expect(account.email).toBe(accountParams.email)
      expect(account.password).toBe(accountParams.password)
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@email.com')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const accountParams = mockAddAccountParams()
      const res = await accountColletion.insertOne(accountParams)
      const fakeAccount = res.ops[0]

      expect(fakeAccount.accessToken).toBeFalsy()

      await sut.updateAccessToken(fakeAccount._id, 'any_token')
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
      expect(account.name).toBe(accountParams.name)
      expect(account.email).toBe(accountParams.email)
      expect(account.password).toBe(accountParams.password)
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
      expect(account.name).toBe(accountParams.name)
      expect(account.email).toBe(accountParams.email)
      expect(account.password).toBe(accountParams.password)
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
      expect(account.name).toBe(accountParams.name)
      expect(account.email).toBe(accountParams.email)
      expect(account.password).toBe(accountParams.password)
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')

      expect(account).toBeFalsy()
    })
  })
})
