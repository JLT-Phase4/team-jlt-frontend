import { Link, useParams } from 'react-router-dom'
import { addMember, createUser, getTeam } from './../api'
import { useState, useEffect } from 'react'

const CreateTeamMembers = ({ token, isCreatingTeam, setIsCreatingTeam }) => {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  const { teamPk } = useParams()
  const { teamName } = useParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState()
  const [newUser, setNewUser] = useState('')
  const [newMember, setNewMember] = useState('')
  const [team, setTeam] = useState()
  const [isAdding, setIsAdding] = useState(false)

  useEffect(updateTeam, [token, teamPk, newUser, isAdding])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  useEffect(updateMembers, [newUser, newMember, isAdding])
  function updateMembers () {
    if (newUser && isAdding) {
      setNewMember(newUser.username)
      setIsAdding(false)
      setIsCreatingTeam(true)
    }
    setUsername('')
    setPassword('')
  }

  function handleSubmit (event) {
    event.preventDefault()
    createUser(username, password)
      .then(newUser => setNewUser(newUser))
      .then(response =>
        addMember(token, username, teamPk))
      .then(response => setIsAdding(true))
      .catch(error => {
        setErrors(error.message)
      })
  }

  return (
    <div style={{ marginTop: '30px' }} className='page-container'>
      <h2 style={{ marginLeft: '50px' }}>Add New Team Member to <span style={{ color: 'yellowgreen' }}>{teamName}</span></h2>
      <div style={{ marginLeft: '50px' }} className='log-reg-header'>Please write down their username and password for later.</div>

      <div className='flex-sa'>

        <form className='log-reg-header-form' onSubmit={handleSubmit}>
          {errors && (
            <div className='errors'>{errors}</div>
          )}
          <div style={{ color: 'yellowgreen', fontSize: '25px' }}>Choose a Username and Password</div>

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
        {team && (
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='team-scoreblock flex-col'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Current Team Members</span>
            <div className='flex'>
              {team.members.map(member => (
                <Link key={member.username} style={{ fontSize: '22px', marginTop: '10px' }} to={`/user-profile/${member.username}/`} className={`${member.username} flex`}>
                  <div style={{ textAlign: 'center' }}>
                    <div className='avatar-holder-medium' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />
                    <span>{member.username}</span>
                  </div>
                </Link>

                // <ul key={member.username}>
                //   <li>{member.username}</li>
                // </ul>
              ))}
            </div>
            {(newMember !== '')
              ? <>
                <div style={{ color: 'yellowgreen', fontSize: '20px' }}>{newMember} has been added to {team.name}</div>
                <Link to={`/team/${team.pk}`}><button onClick={setIsCreatingTeam(false)} className='log-reg-button' type='submit'>Done Adding Members</button></Link>
              </>
              : <Link to={`/team/${team.pk}`}><button onClick={setIsCreatingTeam(false)} className='log-reg-button' type='submit'>Return to Team Dashboard</button></Link>}
          </div>
        )}

      </div>
    </div>
  )
}

export default CreateTeamMembers
