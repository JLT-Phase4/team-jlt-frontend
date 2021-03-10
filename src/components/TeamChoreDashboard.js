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
                    <p>Team captains assign chores and determine how many points each chore is worth, on a scale of 1 to 10. </p>
                    <p>A daily chore like "make your bed" might be worth 2 points, while a tougher chore like "wash the car" might be worth 8.</p>
                    {isCaptain && <p>It's up to you how to assign points and chores for your family! As the week goes on, each family member collects points.</p>}
                    {isCaptain && <p>Meanwhile, your family can compete with other families based on the percentage of chores you complete.</p>}
                    {isCaptain && <p>The family with the highest percentage of completed chores wins!</p>}
                    {isCaptain && <p>So set up chores and assign them <span><Link style={{ color: `${team.dashboard_style}`, fontWeight: '600' }} to={`/chore-assignment/${team.pk}`}>here, </Link></span>
                      <span>and at the end of the week, you'll see how your family stacks up.</span>
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
