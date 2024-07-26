import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, color }) => {
  const style = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div style={style}> {message} </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [NotificationMessage, setNotificationMessage] = useState(null)
  const [notificationColor, setNoficationColor] = useState('green')

  useEffect(() => {
    personService.getAll()
    .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChnage = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)
    if (existingPerson) {
      if(confirm(`${newName} is already added to phonebook, replace the number witih a new one?`)){
        personService
          .update({...existingPerson, number: newNumber})
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewNumber('')
            setNewName('')
            setNotificationMessage(`Updated ${returnedPerson.name}`)
            setNoficationColor('green')
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            if (error.response.status === 404) {
              setPersons(persons.filter(person => person.id !== existingPerson.id))
            }
            setNotificationMessage(error.response.data.error)
            setNoficationColor('red')
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
      }
    }
    else {
      personService
        .create({
          name: newName,
          number: newNumber
        })
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewNumber('')
          setNewName('')
          setNotificationMessage(`Added ${returnedPerson.name}`)
          setNoficationColor('green')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data)
          setNotificationMessage(error.response.data.error)
          setNoficationColor('red')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if(confirm(`Delete ${person.name}`)){
      personService
        .destroy(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationMessage(`Deleted ${person.name}`)
          setNoficationColor('green')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <Notification message={NotificationMessage} color={notificationColor}/>
      <h2>Phonebook</h2>
      <Filer search={search} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <PersonForm
        handleSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChnage={handleNumberChnage}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deleter={deletePerson}/>
    </div>
  )
}

const PersonForm = ({handleSubmit, newName, handleNameChange, newNumber, handleNumberChnage}) =>
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} 
      onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChnage}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Filer = ({search, handleSearchChange}) => 
  <div>
    filter shown with <input value={search} onChange={handleSearchChange} />
  </div>


const Persons = ({ persons, deleter }) => {
  return (
    persons.map(person =>
      <Person 
        key={person.name}
        name={person.name}
        number={person.number}
        deleter={() => deleter(person.id)}/>)
  )
}

const Person = ({ name, number, deleter}) =>
  <div>
    {name} {number} <button onClick={deleter}>delete</button>
  </div>


export default App