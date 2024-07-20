import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAll()
    .then(initialCountries => {
      setCountries(initialCountries)
      setSearch('')
    })
  }, [])

  useEffect(() => {
    if(countriesToShow.length === 1){
      weatherService.getCity(countriesToShow[0].capital)
      .then(weatherData => setWeather(weatherData))
    }
    else{
      setWeather(null)
    }
  }, [countriesToShow])

  const handleSearchChange = (event) => {
    const newSearch = event.target.value
    setSearch(newSearch)
    setCountriesToShow(countries.filter(country => 
        country.name.common.toLowerCase().includes(newSearch.toLowerCase())
  ))
  }

  const handleShow = (name) => {
    setSearch(name)
    setCountriesToShow([countries.find(country => country.name.common === name)])
  }

  return(
    <div>
      <Filter search={search} handler={handleSearchChange} />
      <Countries
        countries={countriesToShow} 
        handleShow={handleShow} 
      />
      <Weather data={weather} />
    </div>
  )
}

const Filter = ({ search, handler }) => 
  <div>
    find countries <input value={search} onChange={handler} onFocus={handler}/>
  </div>

const Countries = ({ countries, handleShow }) => {
  if (countries.length > 10){
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1){
    return <Country country={countries[0]} />
  }

  return(
    countries.map(country =>
      <div key={country.name.common}>
        {country.name.common}
        <Button text='show' handler={() => handleShow(country.name.common)} />
      </div>
    )
  )
}

const Button = ({ text, handler }) => {
  return(
    <button onClick={handler}>{text}</button>
  )
}

const Country = ({ country}) => {
  return(
    <div>
      <h2>{country.name.common}</h2>
      <p>capita {country.capital}</p>
      <p>area {country.area}</p>
      <h4>languages:</h4>
      <Languages languages={country.languages} />
      <img src={country.flags.png} alt={country.flags.alt}/>
    </div>
  )
}

const Weather = ({ data }) => {
  if(!data){
    return null
  }
  return(
    <div>
      <h3>Weather in {data.name}</h3>
      <p>temperature {(data.main.temp-273.15).toFixed(2)} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}/>
      <p>wind {data.wind.speed} m/s</p>
    </div>
  )
}
  


const Languages = ({ languages }) => {
  return(
    <ul>
      {Object.values(languages).map(language => 
        <li key={language}>{language}</li>)}
    </ul>
  )
}

export default App
