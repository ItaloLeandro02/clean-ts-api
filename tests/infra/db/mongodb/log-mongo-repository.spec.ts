import { Collection } from 'mongodb'
import { LogMongoRepository, MongoHelper } from '@/infra/db/mongodb'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorColletion: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorColletion = MongoHelper.getCollection('errors')
    await errorColletion.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorColletion.countDocuments()
    expect(count).toBe(1)
  })
})
