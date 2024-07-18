import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text='give feedback' />
      <Button handleClick={() => setGood(good + 1)} text='good'/>
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <Header text='statistics' />
      <Stats good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

const Header = ({text}) => <h1>{text}</h1>

const Button = ({handleClick, text}) => 
  <button onClick={handleClick}>{text}</button>

const Stats = ({good, neutral, bad}) => {
  const total = good + bad + neutral

  if (total) {
    return (
      <table>
        <tbody>
          <StatisticLine text='good' value={good}/>
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='average' value={(good - bad) / total} />
          <StatisticLine text='positive' value={good*100 / total + ' %'} />
        </tbody>
      </table>
    )
  }
  else {
    return <p>No feedback given</p>
  }
}

const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

export default App