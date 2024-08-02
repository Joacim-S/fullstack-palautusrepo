import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [NotificationMessage, setNotificationMessage] = useState(null)
  const [notificationColor, setNoficationColor] = useState('green')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
    }
    catch (exception) {
      handleException(exception)
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    
    try {
      const newBlog = await blogService.create({
        title,
        author,
        url
      })
      setBlogs(blogs.concat(newBlog))
      setAuthor('')
      setUrl('')
      setTitle('')
      handleNotification(`a new blog ${newBlog.title} by ${newBlog.author} added!`)
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
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <CreateBlogForm
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
        handleSubmit={handleCreateBlog}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App