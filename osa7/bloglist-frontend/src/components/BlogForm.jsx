import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [visible, setVisible] = useState(false)

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setAuthor('')
    setUrl('')
    setTitle('')
    setVisible(!visible)
  }

  if (!visible) {
    return (
      <div>
        <button onClick={() => setVisible(!visible)}>new blog</button>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <h2>create new</h2>
        <div>
          title:
          <input
            data-testid='title'
            type='text'
            value={title}
            name='Title'
            onChange={({ target }) => setTitle(target.value)}
            placeholder='My blog'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            type='text'
            value={author}
            name='Author'
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='Matti Meikäläinen'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            type='text'
            value={url}
            name='Url'
            onChange={({ target }) => setUrl(target.value)}
            placeholder='meikäblogi.fi'
          />
        </div>
        <button type='submit'>create</button>
      </form>
      <button onClick={() => setVisible(!visible)}>cancel</button>
    </div>
  )
}

export default BlogForm
