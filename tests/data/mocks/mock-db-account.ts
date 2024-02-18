import { faker } from '@faker-js/faker'
import { AddAccountRepository, CheckAccountByEmailRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols/db/account'

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true
  addAccountData: AddAccountRepository.Params

  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountData = data
    return await Promise.resolve(this.result)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  result = {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    password: faker.internet.password()
  }

  email: string

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return await Promise.resolve(this.result)
  }
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  result = false
  email: string

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email
    return await Promise.resolve(this.result)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  result = { id: faker.string.uuid() }
  token: string
  role?: string

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token
    this.role = role
    return await Promise.resolve(this.result)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
    await Promise.resolve()
  }
}
