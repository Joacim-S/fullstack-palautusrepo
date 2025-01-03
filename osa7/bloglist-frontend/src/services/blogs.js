import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${baseUrl}/${blogObject.id}`

  const response = await axios.put(url, blogObject, config)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }
  const url = `${baseUrl}/${id}`

  const response = await axios.delete(url, config)
  return response.data
}

export default { getAll, setToken, create, update, remove }
