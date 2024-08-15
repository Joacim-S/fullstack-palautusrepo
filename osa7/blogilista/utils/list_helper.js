const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((a, c) => a + c.likes, 0)

const favoriteBlog = blogs => {
  if (!blogs.length) {
    return null
  }
  return blogs.reduce((fav, current) =>
    fav.likes >= current.likes ? fav : current,
  )
}

const mostBlogs = blogs => {
  if (!blogs.length) {
    return null
  }
  const blogsByMostActive = _.sortBy(_.groupBy(blogs, 'author'), 'length').pop()
  return {
    author: blogsByMostActive[0].author,
    blogs: blogsByMostActive.length,
  }
}

const mostLikes = blogs => {
  if (!blogs.length) {
    return null
  }
  const likes = {}

  blogs.forEach(blog => {
    if (!likes[blog.author]) {
      likes[blog.author] = blog.likes
    } else {
      likes[blog.author] += blog.likes
    }
  })

  let maxLikes = -Infinity
  let fav = ''

  for (const [author, likeCount] of Object.entries(likes)) {
    if (likeCount >= maxLikes) {
      maxLikes = likeCount
      fav = author
    }
  }

  return {
    author: fav,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
