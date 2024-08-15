import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'test Blog',
    author: 'test Author',
    url: 'test url',
    likes: 10
  }

  render(<Blog blog={blog} />)
  screen.getByText('test Blog test Author')
})

test('renders url and likes after clicking view', async () => {
  const blog = {
    title: 'test Blog',
    author: 'test Author',
    url: 'test url',
    likes: 10,
    user: { name: 'testname' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)
  screen.getByText('likes: 10')
  screen.getByText('test url')
})

test('liking twice causes two likehandler calls', async () => {
  const blog = {
    title: 'test Blog',
    author: 'test Author',
    url: 'test url',
    likes: 10,
    user: { name: 'testname' }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} />
  )

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})