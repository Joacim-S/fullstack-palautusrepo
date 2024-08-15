import { useState } from 'react'

const Blog = ({ blog, handleLike, user, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showFull, setShowFull] = useState(false)

  if (!showFull) {
    return(
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button
          style={{ marginLeft: 5 }}
          onClick={() => setShowFull(!showFull)}>
            view
        </button>
      </div>
    )
  }

  return(
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button
        onClick={() => setShowFull(!showFull)}
        style={{ marginLeft: 5 }}>
          hide
      </button>
      <div>
        {blog.url}
      </div>
      <div>
        likes: {blog.likes}
        <button
          onClick={() => handleLike({
            ...blog,
            likes: blog.likes+1,
            user: blog.user.id })}>
            like
        </button>
      </div>
      <div>
        {blog.user.name}
      </div>
      <button style={{
        display: blog.user.username && blog.user.username !== user
          ? 'none'
          : '' }}
      onClick={() => handleDelete(blog)}>
          remove
      </button>
    </div>
  )
}

export default Blog