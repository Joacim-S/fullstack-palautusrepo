const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((a, c) => a + c.likes, 0)

const favoriteBlog = (blogs) => {
  if(!blogs.length){
    return null
  }
  return (
  blogs.reduce((fav, current) =>
    fav.likes >= current.likes
    ? fav
    : current)
)
}

const mostBlogs = (blogs) => {
  if(!blogs.length){
    return null
  }
  const blogsByMostActive = _.sortBy(_.groupBy(blogs, 'author'), 'length').pop()
  return (
    {
      author: blogsByMostActive[0].author,
      blogs: blogsByMostActive.length
    }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}