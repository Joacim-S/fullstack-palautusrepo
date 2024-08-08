import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    set(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { set, clearNotification } = notificationSlice.actions

export const setNotification = (message, time) => {
  return async dispatch => {
    await dispatch(set(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time*1000)
  }
}

export default notificationSlice.reducer