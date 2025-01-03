const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)
const Blog = require('../models/blog')
let user = ''
let deletee = ''

const blog = {
  title: 'Keijon salaisuudet',
  author: 'Liisa',
  url: 'https://urbaanisanakirja.com/word/keijo/',
  likes: 139
}

before(async () => {
  await User.deleteMany({})
  user = await helper.createUserAndGetToken(api)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there is the right amount of blogs', async () => {
  assert.strictEqual(
    (await api.get('/api/blogs')).body.length,
    helper.blogs.length)
})

test('name of id field is "id"', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    assert(blog.id)
    assert(!blog._id)
  })
})

test('blogs can be added', async () => {
  const blog = {
    title: 'Keijon salaisuudet',
    author: 'Liisa',
    url: 'https://urbaanisanakirja.com/word/keijo/',
    likes: 139
  }
  await api
    .post('/api/blogs')
    .send(blog)
    .set({ 'Authorization': user.token })
    .expect(201)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)
  assert.strictEqual(response.body.length, helper.blogs.length+1)
  assert(titles.includes(blog.title))

})

test('adding a blog fails with status 401 if authorization is not provided', async () => {
  const blog = {
    title: 'Keijon salaisuudet',
    author: 'Liisa',
    url: 'https://urbaanisanakirja.com/word/keijo/',
    likes: 139
  }
  await api
    .post('/api/blogs')
    .send(blog)
    .expect(401)
})

test('likes defaults to 0', async () => {
  const blog = {
    title: 'Keijon salaisuudet',
    author: 'Liisa',
    url: 'https://urbaanisanakirja.com/word/keijo/',
  }

  const response =
    await api
      .post('/api/blogs')
      .send(blog)
      .set({ 'Authorization': user.token })
      .expect(201)

  assert.strictEqual(response.body.likes, 0)

})

test('server responds with 400 if title is missing', async () => {
  const blog = {
    author: 'Liisa',
    url: 'https://urbaanisanakirja.com/word/keijo/',
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .set({ 'Authorization': user.token })
    .expect(400)
})

test('server responds with 400 if url is missing', async () => {
  const blog = {
    title: 'Keijon salaisuudet',
    author: 'Liisa',
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .set({ 'Authorization': user.token })
    .expect(400)
})

describe('deletion of a blog', async () => {
  test('succees with valid id', async () => {
    const createResult = await api
      .post('/api/blogs')
      .send(blog)
      .set({ 'Authorization': user.token })
      .expect(201)
    deletee = createResult.body
    await api
      .delete(`/api/blogs/${deletee.id}`)
      .set({ 'Authorization': user.token })
      .expect(204)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert(!titles.includes(deletee.title))
    assert.strictEqual(response.body.length, helper.blogs.length)
  })

  test('multiple times has same result as doing it once', async () => {
    const testDelete = async () => {
      await api
        .delete(`/api/blogs/${deletee.id}`)
        .set({ 'Authorization': user.token })
        .expect(204)

      const response = await api.get('/api/blogs')
      const titles = response.body.map(blog => blog.title)

      assert(!titles.includes(deletee.title))
      assert.strictEqual(response.body.length, helper.blogs.length)
    }

    for (let i = 0; i < 5; i++) {
      await testDelete()
    }
  })

  test('fails with status code 400 with invalid id', async () => {
    await api
      .delete('/api/blogs/313')
      .set({ 'Authorization': user.token })
      .expect(400)
  })
})

describe('editing blog', () => {
  const editee = helper.blogs[0]
  test('likes succeeds', async () => {
    const response = await api.put(`/api/blogs/${editee._id}`).send(
      {
        ...editee,
        likes: editee.likes+10
      }
    )
    assert.strictEqual(response.body.likes, editee.likes+10)
  })

  test('author succeeds', async () => {
    const response = await api.put(`/api/blogs/${editee._id}`).send(
      {
        ...editee,
        author: 'Tommi'
      }
    )
    assert.strictEqual(response.body.author, 'Tommi')
  })

  test('url succeeds', async () => {
    const response = await api.put(`/api/blogs/${editee._id}`).send(
      {
        ...editee,
        url: 'teronblogi.fi'
      }
    )
    assert.strictEqual(response.body.url, 'teronblogi.fi')
  })

  test('title succeeds', async () => {
    const response = await api.put(`/api/blogs/${editee._id}`).send(
      {
        ...editee,
        title: 'Kalaretket'
      }
    )
    assert.strictEqual(response.body.title, 'Kalaretket')
  })
})



after(async () => {
  await mongoose.connection.close()
})