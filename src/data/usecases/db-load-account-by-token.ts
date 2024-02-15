import { LoadAccountByToken } from '@/domain/usecases'
import { Decrypter } from '@/data/protocols/criptography'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    const token = await this.getToken(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
      if (account) {
        return account
      }
    }
    return null
  }

  private async getToken (accessToken: string): Promise<string | null> {
    try {
      return await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
  }
}
