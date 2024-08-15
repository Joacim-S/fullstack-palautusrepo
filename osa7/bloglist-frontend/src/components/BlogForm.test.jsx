import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> can be opened and calls handler with right data', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)
  const newBlogButton = screen.getByText('new blog')
  await user.click(newBlogButton)

  const titleField = screen.getByPlaceholderText('My blog')
  const authorField = screen.getByPlaceholderText('Matti Meikäläinen')
  const urlField = screen.getByPlaceholderText('meikäblogi.fi')
  const sendButton = screen.getByText('create')

  await user.type(titleField, 'Testing title')
  await user.type(authorField, 'Testing author')
  await user.type(urlField, 'Testing url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('Testing url')
})
