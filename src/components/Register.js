import { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { register } from '../api'
import Welcome from './Welcome'
import Carousel from 'react-bootstrap/Carousel'
import PodView from './../images/PodView.jpg'
import ProfileView from './../images/ProfileView.jpg'
import TeamView from './../images/TeamView.jpg'
import ChoreAssignmentView from './../images/ChoreAssignmentView.jpg'
import ChoreManagementView from './../images/ChoreManagementView.jpg'

function Register ({ isLoggedIn, setAuth }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState()

  if (isLoggedIn) {
    return <Redirect to='/login' />
  }

  // Add a .then to handleSubmit that will do a post to make user a captain
  // Need an api for that

  function handleSubmit (event) {
    event.preventDefault()
    register(username, password)
      .then(data => {
        if (data && data.auth_token) {
          setAuth(username, data.auth_token)
        }
      })
      .catch(error => {
        setErrors(error.message)
      })
  }

  return (
    <div style={{ marginLeft: '50px' }} className='flex-col-center'>
      <div className='flex-col'>
        {/* <h2 className='log-reg-header'>Register or <Link to='/login'>Login</Link></h2> */}
        <div>
          <form className='flex' onSubmit={handleSubmit}>
            <h2>Register or <Link to='/login'>Login</Link></h2>
            {errors && (
              <div className='errors'>{errors}</div>
            )}
            <div>
              <label htmlFor='username'>Username</label>
              <input
                type='text'
                id='username'
                required
                value={username}
                onChange={event => setUsername(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </div>
            <button style={{ margin: '0' }} className='log-reg-button' type='submit'>Register</button>
          </form>
        </div>
        <Welcome />

      </div>
      <Carousel>
        <Carousel.Item style={{ width: '1250px', height: '70vh', backgroundSize: 'cover', backgroundImage: `url(${PodView})` }} className='carousel-holder' />
        <Carousel.Item style={{ width: '1250px', height: '70vh', backgroundSize: 'cover', backgroundImage: `url(${ProfileView})` }} className='carousel-holder' />
        <Carousel.Item style={{ width: '1250px', height: '70vh', backgroundSize: 'cover', backgroundImage: `url(${TeamView})` }} className='carousel-holder' />
        <Carousel.Item style={{ width: '1250px', height: '70vh', backgroundSize: 'cover', backgroundImage: `url(${ChoreAssignmentView})` }} className='carousel-holder' />
        <Carousel.Item style={{ width: '1250px', height: '70vh', backgroundSize: 'cover', backgroundImage: `url(${ChoreManagementView})` }} className='carousel-holder' />

      </Carousel>

    </div>
  )
}

export default Register
