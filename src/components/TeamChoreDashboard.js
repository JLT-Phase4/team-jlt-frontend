import { useParams, Redirect, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getTeam, createChore, getChores, deleteChore } from './../api'
import { Card } from 'react-bootstrap'

const TeamChoreDashboard = ({ token, teams, myTeam, isCaptain }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [isCreating, setIsCreating] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [choreName, setChoreName] = useState('')
  const [choreDetail, setChoreDetail] = useState('')
  const [chorePoints, setChorePoints] = useState(1)
  const [teamChores, setTeamChores] = useState([])
  const [isShowing, setIsShowing] = useState(false)

  useEffect(updateTeamChores, [token, teamPk, isAdding, setIsAdding, setIsCreating])

  function updateTeamChores () {
    getTeam(token, teamPk).then(team => {
      setTeam(team)
      getChores(token).then(chores => {
        let newChores = []
        for (const chore of chores) {
          if (chore.team === team.name) {
            newChores = newChores.concat(chore)
          }
        }
        setTeamChores(newChores)
      })
    }
    )
  }

  function handleCreate (e) {
    e.preventDefault()
    if (team) {
      createChore(token, choreName, choreDetail, chorePoints, team.name).then(chore => updateTeamChores()).then(
        setIsCreating(false),
        setIsAdding(true)
      )
    }
  }

  function handleDelete (chorePk) {
    deleteChore(token, chorePk).then(
      updateTeamChores()
    )
  }

  if (!token) {
    return <Redirect to='/login' />
  }

  return (
    <div className='flex-col-center'>
      {(team && teamChores) && (
        <div>
          <div className='flex-col'>
            <h2 style={{ paddingLeft: '20px', marginTop: '20px', marginBottom: '10px', marginLeft: '20px' }}>Chores for <span style={{ color: `${team.dashboard_style}` }}>{team.name}</span></h2>
            <div style={{ width: '1350px', marginRight: '40px', marginLeft: '40px' }} className='chore-detail-container flex-col'>
              {/* {teamChores.length > 0 &&
                <div className='flex'>
                  {teamChores.map((chore, idx) => (
                    <Card
                      key={idx}
                      className='chore-card-container'
                    >
                      <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}` }}>{chore.name}</Card.Body>
                    </Card>
                  ))}
                </div>} */}
              {isCreating
                ? <Card>
                  <Card.Body>
                    <form onSubmit={(e) => handleCreate(e)}>
                      <label style={{ color: `${team.dashboard_style}` }} className='chore-detail' htmlFor='chore-title'>Chore Title</label>
                      <input type='text' id='chore-title' required value={choreName} onClick={event => setChoreName('')} onChange={evt => setChoreName(evt.target.value)} />
                      <label style={{ color: `${team.dashboard_style}` }} className='chore-detail' htmlFor='chore-detail'>Chore Detail</label>
                      <input style={{ width: '300px' }} type='textarea' id='chore-detail' required value={choreDetail} onClick={event => setChoreDetail('')} onChange={evt => setChoreDetail(evt.target.value)} />
                      <label style={{ color: `${team.dashboard_style}` }} className='chore-detail' htmlFor='point-detail'>Chore Point Value</label>
                      <input style={{ width: '50px', marginRight: '5px' }} type='number' id='point-value' required value={chorePoints} onChange={event => setChorePoints(event.target.value)} />
                      <button className='log-reg-button' type='submit'>Complete</button>
                    </form>
                  </Card.Body>
                  <Card.Body onClick={() => setIsCreating(false)}>
                    Return to Detail View
                  </Card.Body>
                </Card>
                : <Card className='flex'>
                  {isCaptain
                    ? <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, color: 'white', backgroundColor: `${team.dashboard_style}`, width: '150px' }}>
                      <span onClick={() => setIsCreating(true)}>Create a Chore</span>
                      </Card.Body>
                    : null}
                  <Card.Body onClick={() => setIsShowing(!isShowing)} className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, color: 'white', backgroundColor: `${team.dashboard_style}`, width: '150px' }}>How it Works
                  </Card.Body>
                  <Card.Body className={isShowing ? 'instruction-detail' : 'hide-me'}>
                    <p>Each chore is worth a certain number of points assigned by the team captain. Points can be between 1 and 10 for a given chore. </p>
                    <p>Something like 'make your bed' that is done every day might be worth 2 points, while something like 'wash the car' might be worth more. </p>
                    {isCaptain && <p>You get to choose for your family! Each player collects points as the week goes along and families can compete based on their percentage complete.</p>}
                    {isCaptain && <p>After chores are set up <span><Link style={{ color: `${team.dashboard_style}`, fontWeight: '600' }} to={`/chore-assignment/${team.pk}`}>assign away </Link></span>
                      <span>knowing that everyone will be scored on their percent complete!</span>
                                  </p>}
                  </Card.Body>
                  </Card>}
            </div>
            {teamChores.length > 0 &&
              <div className='flex-col'>
                <h2 style={{ paddingLeft: '20px', margin: '20px', marginTop: '50px' }}>Chore Detail and Points</h2>
                <div style={{ padding: '20px', width: '1350px', marginLeft: '40px', marginRight: '40px' }} className='flex chore-detail-container'>
                  {teamChores.map((chore, idx) => (
                    <div style={{ border: `2px solid ${team.dashboard_style}` }} className='chore-card-detail chore-detail-container flex-col' key={idx}>
                      <div className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, color: 'white', backgroundColor: `${team.dashboard_style}` }}>{chore.name}</div>
                      <div style={{ padding: '5px' }}>Details: {chore.detail}</div>
                      <div style={{ color: `${team.dashboard_style}`, padding: '5px' }}>Points: {chore.points}</div>
                      {isCaptain && <span onClick={() => handleDelete(chore.pk)} style={{ color: `${team.dashboard_style}` }} className='material-icons'>delete</span>}
                    </div>
                  ))}
                </div>
              </div>}

          </div>
        </div>
      )}
    </div>
  )
}

export default TeamChoreDashboard
