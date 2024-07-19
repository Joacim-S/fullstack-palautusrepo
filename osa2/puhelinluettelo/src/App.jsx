import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

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
        })
    }
  }

  const deletePerson = id => {
    const person = persons.find(p => p.id === id)
    if(confirm(`Delete ${person.name}`)){
      personService
        .destroy(id)
        .then(deleted => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
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