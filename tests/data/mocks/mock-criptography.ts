import { faker } from '@faker-js/faker'
import { Decrypter, Encrypter, HashComparer, Hasher } from '@/data/protocols/criptography'

export class HasherSpy implements Hasher {
  digest = faker.string.uuid()
  plainText: string

  async hash (plainText: string): Promise<string> {
    this.plainText = plainText
    return await Promise.resolve(this.digest)
  }
}

export class DecrypterSpy implements Decrypter {
  plaintext = faker.internet.password()
  ciphertext: string

  async decrypt (ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext
    return await Promise.resolve(this.plaintext)
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.string.hexadecimal()
  plaintext: string

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.ciphertext)
  }
}

export class HashComparerSpy implements HashComparer {
  plainText: string
  digest: string
  isValid = true

  async compare (plainText: string, digest: string): Promise<boolean> {
    this.plainText = plainText
    this.digest = digest
    return await Promise.resolve(this.isValid)
  }
}
