import {Link} from 'react-router-dom'

const About = () => {
  return (
    <>
      <Link className='go-back' to='/'>Go Back</Link>
      <p>
        This Is a React client for demonstrating a multi-container Docker App.
      </p>
    </>
  )
}

export default About