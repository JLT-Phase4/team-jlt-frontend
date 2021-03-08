import { useState } from 'react'
import { login } from '../api'
import { Redirect, Link } from 'react-router-dom'
import Welcome from './Welcome'
import ManageChoresView from './../images/ManageChoresView.jpg'
import CreateTeamView from './../images/CreateTeamView.jpg'
import AssignChoresView from './../images/AssignChoresView.jpg'
import ProfileLevelView from './../images/ProfileLevelView.jpg'
import PodLevelView from './../images/PodLevelView.jpg'
import TeamLevelView from './../images/TeamLevelView.jpg'

function Login ({ isLoggedIn, setAuth }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState()

  if (isLoggedIn) {
    // return <Redirect to='/create-team-dashboard' />
    return <Redirect to='/' />
  }

  function handleSubmit (event, isLoggedIn) {
    event.preventDefault()
    login(username, password)
      .then(data => {
        // console.log(data)
        if (data && data.auth_token) {
          setAuth(username, data.auth_token)
        }
      })
      .catch(error => {
        setErrors(error.message)
      })
  }

  return (

    <div className='login'>
      <div className='login-page-container'>
        <h1>Welcome back!</h1>
        <div className='login-message'>
          <p>Log in to complete tasks</p>
          <p> and rack up points </p>
          <p> for your team.</p>
        </div>
        <div style={{ marginTop: '10px' }}>
          <form className='' onSubmit={handleSubmit}>
            <h2 className='login-header'>Login</h2>
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
              <label className='login-password-label' htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                required
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </div>
            <button style={{ margin: '0' }} className='log-reg-button' type='submit'>Login</button>
          </form>
        </div>
        <p className='route-to-reg'>Not a Chore Wars member? <Link to='/register'>Click here to register.</Link></p>

      </div>

    </div>
  )
}

export default Login
