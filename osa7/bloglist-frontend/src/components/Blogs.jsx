import Blog from '../components/Blog'
import BlogForm from './BlogForm'
import { useSelector } from 'react-redux'

const Blogs = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  return (
    <div>
      <BlogForm />
      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} user={user.username} />
      ))}
    </div>
  )
}

export default Blogs
