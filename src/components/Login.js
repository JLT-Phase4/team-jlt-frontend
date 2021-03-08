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

    <div style={{ marginLeft: '50px' }} className='flex-col-center'>
      <div className='flex-col'>
        <div style={{ marginTop: '10px' }}>
          <form className='flex' onSubmit={handleSubmit}>
            <h2><Link to='/register'>Register</Link> or Login</h2>
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

export default Login
