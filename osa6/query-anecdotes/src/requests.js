import axios from 'axios'

const baseurl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await axios.get(baseurl)
  return response.data
}

export const createAnecdote = async (anecdote) => {
  const response = await axios.post(baseurl, anecdote)
  return response.data
}

export const updateAnecdote = async (anecdote) => {
  const response = await axios.put(`${baseurl}/${anecdote.id}`, anecdote)
  return response.data
}