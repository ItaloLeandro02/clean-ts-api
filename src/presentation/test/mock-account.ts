import faker from 'faker'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationModel } from '@/domain/models/authentication'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { mockAccountModel } from '@/domain/test'

export class AddAccountSpy implements AddAccount {
  params: AddAccountParams
  account = mockAccountModel()

  async add (params: AddAccountParams): Promise<AccountModel> {
    this.params = params

    return await Promise.resolve(this.account)
  }
}

export class AuthenticationSpy implements Authentication {
  authentication: AuthenticationParams
  authenticationModel = {
    accessToken: faker.random.word(),
    name: faker.name.findName()
  }

  async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
    this.authentication = authentication

    return Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role?: string
  account = mockAccountModel()

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role

    return Promise.resolve(this.account)
  }
}
