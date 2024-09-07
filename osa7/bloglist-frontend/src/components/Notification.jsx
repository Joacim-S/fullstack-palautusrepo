import { useSelector } from 'react-redux'

const Notification = () => {
  const { color, message } = useSelector(state => state.notification)
  const style = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  return <div style={style}> {message} </div>
}

export default Notification
