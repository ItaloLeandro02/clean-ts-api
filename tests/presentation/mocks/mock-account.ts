import faker from 'faker'
import { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  result = true
  params: AddAccount.Params

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    return await Promise.resolve(this.result)
  }
}

export class AuthenticationSpy implements Authentication {
  result = {
    accessToken: faker.random.word(),
    name: faker.name.findName()
  }

  authentication: Authentication.Params

  async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
    this.authentication = authentication
    return Promise.resolve(this.result)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  result = { id: faker.random.uuid() }
  accessToken: string
  role?: string

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return Promise.resolve(this.result)
  }
}
