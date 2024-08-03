import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [NotificationMessage, setNotificationMessage] = useState(null)
  const [notificationColor, setNoficationColor] = useState('green')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleException = exception => {
    setNotificationMessage(exception.response.data.error)
    setNoficationColor('red')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const handleNotification = message => {
    setNotificationMessage(message)
    setNoficationColor('green')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const handleLike = async (blog) => {
    try {
      const returnedBlog = await blogService.update(blog)
      setBlogs(blogs.map(
        blog => blog.id.toString() === returnedBlog.id.toString()
          ? { ...returnedBlog, user: blog.user }
          : blog
      )
        .sort((a, b) => b.likes - a.likes)
      )
    }
    catch (exception) {
      handleException(exception)
    }
  }

  const handleDelete = async (deletee) => {
    if (window.confirm(`Remove blog ${deletee.title} by ${deletee.author}`)) {
      try {
        await blogService.remove(deletee.id)
        setBlogs(blogs.filter(blog => blog.id !== deletee.id))
      }
      catch (exception) {
        handleException(exception)
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      handleNotification(`Welcom ${user.name}`)
      blogService.setToken(user.token)
    }
    catch (exception) {
      handleException(exception)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create( blogObject )
      setBlogs(blogs.concat({ ...returnedBlog, user: { name: user.name } }))
      handleNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added!`)
    }
    catch(exception) {
      handleException(exception)
    }
  }

  const handleLogout  = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  if (!user) {
    return (
      <div>
        <Notification message={NotificationMessage} color={notificationColor}/>
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          setUser={setUser}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={NotificationMessage} color={notificationColor}/>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <BlogForm createBlog={addBlog}
      />
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          user={user.username}
          handleDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App