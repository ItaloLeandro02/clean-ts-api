import faker from 'faker'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { Decrypter } from '@/data/protocols/criptography/decrypter'

export class HasherSpy implements Hasher {
  digest = faker.random.uuid()
  plainText: string

  async hash (plainText: string): Promise<string> {
    this.plainText = plainText

    return Promise.resolve(this.digest)
  }
}

export class DecrypterSpy implements Decrypter {
  plaintext = faker.internet.password()
  ciphertext: string

  async decrypt (ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext

    return Promise.resolve(this.plaintext)
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.random.hexaDecimal()
  plaintext: string

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext

    return Promise.resolve(this.ciphertext)
  }
}

export class HashComparerSpy implements HashComparer {
  plainText: string
  digest: string
  isValid = true

  async compare (plainText: string, digest: string): Promise<boolean> {
    this.plainText = plainText
    this.digest = digest

    return Promise.resolve(this.isValid)
  }
}
