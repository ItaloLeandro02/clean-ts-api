import request from 'supertest'
import { Express } from 'express'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { setupApp } from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb'

let accountColletion: Collection
let app: Express

describe('Login GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('Login Query', () => {
    const query = `query {
        login (email: "italo@mail.com", password: "12345") {
            accessToken
            name
        }
    }`
    test('Should return an Account on valid credentials', async () => {
      const password = await hash('12345', 12)
      await accountColletion.insertOne({
        name: 'Italo',
        email: 'italo@mail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe('Italo')
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `mutation {
        signUp (name: "Italo", email: "italo@mail.com", password: "12345", passwordConfirmation: "12345") {
            accessToken
            name
        }
    }`

    test('Should return an Account on valid data', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.name).toBe('Italo')
    })

    test('Should return an Account on valid data', async () => {
      const password = await hash('12345', 12)
      await accountColletion.insertOne({
        name: 'Italo',
        email: 'italo@mail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('The received email is already in use')
    })
  })
})
