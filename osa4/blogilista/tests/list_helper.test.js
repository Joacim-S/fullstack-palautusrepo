const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const helper = require('./test_helper')

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
    assert.strictEqual(listHelper.totalLikes([helper.blogs[0]]), 7)
  })

  test('when list has many blogs equals the sum of their likes', () => {
    assert.strictEqual(listHelper.totalLikes(helper.blogs), 36)
  })
})

describe('favourite blog', () => {

  test('when list has many blogs, equals the blog with most votes', () => {
    assert.strictEqual(listHelper.favoriteBlog(helper.blogs), helper.blogs[2])
  })

  test('when list is empty, equals null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has one blog, equals the blog', () => {
    assert.strictEqual(listHelper.favoriteBlog([helper.blogs[2]]), helper.blogs[2])
  })

  test('when list has many blogs with most likes, equals the first of them', () => {
    assert.strictEqual(listHelper.favoriteBlog(helper.blogs.concat({ likes: 12 } )), helper.blogs[2])
  })
})

describe('most blogs', () => {

  test('when list has many blogs, shows most active and blog count', () => {
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(listHelper.mostBlogs(helper.blogs), expected)
  })

  test('when list is empty, equals null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('wheln list has many most active authors, returns last one mentioned', () => {
    const blogList = helper.blogs.slice(0,-1)
    assert.deepStrictEqual(listHelper.mostBlogs(blogList),
      { author: 'Robert C. Martin', blogs: 2 }
    )
    assert.deepStrictEqual(listHelper.mostBlogs(blogList.reverse()),
      { author: 'Edsger W. Dijkstra', blogs: 2 }
    )
  })
})

describe('most likes', () => {
  test('shows most popular author with correct likecount when list has many blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes(helper.blogs),
      { author: 'Edsger W. Dijkstra', likes: 17 }
    )
  })

  test('equals null when list is empty', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })
})