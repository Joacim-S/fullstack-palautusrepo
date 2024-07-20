import axios from 'axios'
const api_key = import.meta.env.VITE_WEATHER_KEY

const getCity = (city) => {
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)
  return request.then(response => response.data)
}

export default {getCity}