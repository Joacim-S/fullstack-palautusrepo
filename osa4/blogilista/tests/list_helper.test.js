const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

  test('when list is empty, equals 0', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), 7)
  })

  test('when list has many blogs equals the sum of their likes', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
  })
})

describe('favourite blog', () => {

  test('when list has many blogs, equals the blog with most votes', () => {
    assert.strictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })

  test('when list is empty, equals null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has one blog, equals the blog', () => {
    assert.strictEqual(listHelper.favoriteBlog([blogs[2]]), blogs[2])
  })

  test('when list has many blogs with most likes, equals the first of them', () => {
    assert.strictEqual(listHelper.favoriteBlog(blogs.concat({ likes: 12} )), blogs[2])
  })
})

describe('most blogs', () => {

  test('when list has many blogs, shows most active and blog count', () => {
    expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), expected)
  })

  test('when list is empty, equals null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('wheln list has many most active authors, returns last one mentioned', () => {
    const blogList = blogs.slice(0,-1)
    assert.deepStrictEqual(listHelper.mostBlogs(blogList),
      { author: 'Robert C. Martin', blogs: 2}
    )
    assert.deepStrictEqual(listHelper.mostBlogs(blogList.reverse()),
      { author: 'Edsger W. Dijkstra', blogs: 2}
    )
  })
})