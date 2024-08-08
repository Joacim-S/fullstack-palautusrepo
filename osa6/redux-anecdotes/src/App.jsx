import { useEffect } from 'react' 
import AnecdoteList from './components/AnecdoteList'
import AnecdodeForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { intializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(intializeAnecdotes())
  }, [])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdodeForm />
    </div>
  )
}


export default App