import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '@/data/protocols/criptography'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return await jwt.sign({ id: value }, this.secret)
  }

  async decrypt (token: string): Promise<string> {
    return await jwt.verify(token, this.secret) as string
  }
}
