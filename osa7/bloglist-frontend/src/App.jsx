import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logInUser, logoutUsser } from './reducers/userReducer'
import { Routes, Route, Link } from 'react-router-dom'
import Blogs from './components/Blogs'
import Users from './components/Users'

const App = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [user, dispatch])

  const handleLogin = async event => {
    event.preventDefault()
    dispatch(logInUser(username, password))
    setUsername('')
    setPassword('')
  }

  if (!user) {
    return (
      <div>
        <Notification />
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={() => dispatch(logoutUsser())}>logout</button>
      </p>
      <Routes>
        <Route path='/' element={<Blogs />} />
        <Route path='users' element={<Users />} />
      </Routes>
    </div>
  )
}

export default App
