const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('user creation', () => {
  test('succeeds with proper info', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Teuvo99',
      name: 'Teuvo',
      password: 'salaTeuvo'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })


  describe('fails with status 400 and correct error when', () => {
    test('username is missing', async () => {
      const newUser = {
        name: 'Teuvo',
        password: 'salaTeuvo'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('Path `username` is required'))
    })

    test('username is too short', async () => {
      const newUser = {
        username: 'Te',
        name: 'Teuvo',
        password: 'salaTeuvo'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      assert(result.body.error.includes('`username` (`Te`) is shorter than the minimum allowed length'))
    })

    test('username is not unique', async () => {
      const newUser = {
        username: 'Teuvo99',
        name: 'Teuvo',
        password: 'salaTeuvo'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('expected `username` to be unique'))
    })

    test('password is missing', async () => {
      const newUser = {
        username: 'Teuvo99',
        name: 'Teuvo'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('password must be at least 3 characters long'))
    })

    test('password is too short', async () => {
      const newUser = {
        username: 'Teuvo99',
        name: 'Teuvo',
        password: 'st'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(result.body.error.includes('password must be at least 3 characters long'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})