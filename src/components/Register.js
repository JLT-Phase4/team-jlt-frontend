import { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { register } from '../api'
import Welcome from './Welcome'
import ManageChoresView from './../images/ManageChoresView.jpg'
import CreateTeamView from './../images/CreateTeamView.jpg'
import AssignChoresView from './../images/AssignChoresView.jpg'
import ProfileLevelView from './../images/ProfileLevelView.jpg'
import PodLevelView from './../images/PodLevelView.jpg'
import TeamLevelView from './../images/TeamLevelView.jpg'

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
    <div style={{ marginLeft: '50px' }} className='flex-col'>
      <div className=''>
        <Welcome />
      </div>
      <form className='reg' onSubmit={handleSubmit}>
        <h2>Register</h2>
        {errors && (
          <div className='errors'>{errors}</div>
        )}
        <div>
          <label className='username-label' htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            required
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          <label className='password-label' htmlFor='password'>Password</label>
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
      <div>
        <p className='route-to-reg'>Already a Chore Wars member? <Link to='/login'>Click here to log in.</Link></p>
      </div>
      <div className='flex'>
        <a href={PodLevelView}><img className='welcome-page-card' src={PodLevelView} /></a>
        <a href={CreateTeamView}><img className='welcome-page-card' src={CreateTeamView} /></a>
        <a href={ManageChoresView}><img className='welcome-page-card' src={ManageChoresView} /></a>
        <a href={AssignChoresView}><img className='welcome-page-card' src={AssignChoresView} /></a>
        <a href={ProfileLevelView}><img className='welcome-page-card' src={ProfileLevelView} /></a>
        <a href={TeamLevelView}><img className='welcome-page-card' src={TeamLevelView} /></a>
      </div>
    </div>
  )
}

export default Register
