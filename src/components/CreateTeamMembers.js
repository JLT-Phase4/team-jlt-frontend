import { Link, useParams } from 'react-router-dom'
import { addMember, createUser } from './../api'
import { useState } from 'react'

const CreateTeamMembers = ({ token }) => {
  const { teamPk } = useParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState()
  const [newUser, setNewUser] = useState('')

  function handleSubmit (event) {
    event.preventDefault()
    createUser(username, password)
      .then(newUser => setNewUser(newUser))
      .then(() =>
        addMember(token, username, teamPk)
      )

      .catch(error => {
        setErrors(error.message)
      })
    // if (newUser) {
    //   console.log(newUser.username)
    // }
    // if (newUser) {
    //   addMember(token, newUser.username, teamPk)
    // }
  }

  return (
    <div className='page-container'>
      <h2 className='log-reg-header'>Register or <Link to='/login'>Login</Link></h2>
      <form className='log-reg-header-form' onSubmit={handleSubmit}>
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

        <button className='log-reg-button' type='submit'>Create New User</button>
      </form>
    </div>
  )
}

export default CreateTeamMembers
