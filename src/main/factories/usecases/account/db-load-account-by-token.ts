import env from '@/main/config/env'
import { DbLoadAccountByToken } from '@/data/usecases/account'
import { LoadAccountByToken } from '@/domain/usecases/account'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { JwtAdapter } from '@/infra/criptography'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
