import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { color: 'green', message: null },
  reducers: {
    set(state, action) {
      return action.payload
    },
    clearNotification() {
      return { color: 'green', message: null }
    },
  },
})

export const { set, clearNotification } = notificationSlice.actions

export const setNotification = (message, color = 'green') => {
  return async dispatch => {
    await dispatch(set({ message, color }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer
