import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload
    },
  },
})

export const { set } = userSlice.actions

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(set(user))
      blogService.setToken(user.token)
    }
  }
}

export const logInUser = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username,
        password,
      })
      dispatch(set(user))
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      dispatch(setNotification(`Welcom ${user.name}`))
      blogService.setToken(user.token)
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'red'))
    }
  }
}

export const logoutUsser = () => {
  return async dispatch => {
    dispatch(set(null))
    window.localStorage.removeItem('loggedBlogAppUser')
  }
}

export default userSlice.reducer
