import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    set(state, action) {
      return action.payload
    },
    append(state, action) {
      state.push(action.payload)
    },
    update(state, action) {
      const updatedBlog = action.payload
      return state
        .map(blog =>
          blog.id.toString() === updatedBlog.id.toString()
            ? { ...updatedBlog, user: blog.user }
            : blog,
        )
        .sort((a, b) => b.likes - a.likes)
    },
    remove(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
  },
})

export const { set, append, update, remove } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(set(blogs.sort((a, b) => b.likes - a.likes)))
  }
}

export const updateBlog = blog => {
  return async dispatch => {
    try {
      const returnedBlog = await blogService.update(blog)
      dispatch(update(returnedBlog))
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'red'))
    }
  }
}

export const createBlog = blogObject => {
  return async dispatch => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      dispatch(append({ ...returnedBlog, user: { name: 'user.name' } })) //TODO: Fix user.name after moving login to redux
      dispatch(
        setNotification(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added!`,
        ),
      )
    } catch (exception) {
      dispatch(setNotification(exception.response.data.error, 'red'))
    }
  }
}

export const deleteblog = deletee => {
  return async dispatch => {
    if (window.confirm(`Remove blog ${deletee.title} by ${deletee.author}`)) {
      try {
        await blogService.remove(deletee.id)
        dispatch(remove(deletee.id))
      } catch (exception) {
        dispatch(setNotification(exception.response.data.error, 'red'))
      }
    }
  }
}

export default blogSlice.reducer
