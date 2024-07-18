const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
  <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  const content = props.parts.map(value => <Part part={value.name} exercises={value.exercises} />)
  return(
    <div>
      {content[0]}
      {content[1]}
      {content[2]}
    </div>
  )
}

const Part = (props) => {
  return(
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Total = (props) => {
  let total = 0
  props.parts.forEach(value => total += value.exercises)
  return (
    <p>
      Number of exercises {total}
    </p>
  )
}

export default App