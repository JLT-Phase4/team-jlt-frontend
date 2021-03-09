import { useParams, Link, Redirect } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getTeam, createChore, getChores } from './../api'
import { Card } from 'react-bootstrap'
import { MDBPopover, MDBPopoverBody, MDBPopoverHeader } from 'mdb-react-ui-kit'
import ScoreBoard from './ScoreBoard'

const TeamChoreDashboard = ({ token, teams, myTeam, isCaptain }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [isCreating, setIsCreating] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [choreName, setChoreName] = useState('')
  const [choreDetail, setChoreDetail] = useState('')
  const [chorePoints, setChorePoints] = useState(1)
  const [teamChores, setTeamChores] = useState([])

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

  if (!token) {
    return <Redirect to='/login' />
  }

  return (
    <div>
      {(team && teamChores) && (
        <div>
          <div className='flex-col'>
            <h2 style={{ paddingLeft: '20px', margin: '20px' }}>Chores for <span style={{ color: 'yellowgreen' }}>{team.name}</span></h2>
            <div style={{ marginLeft: '40px', marginRight: '40px' }} className='chore-detail-container flex-col'>
              {teamChores.length > 0 &&
                <div className='flex'>
                  {/* style={{ borderRadius: '10px', margin: '5px', border: `3px solid ${team.dashboard_style}`, color: 'white' }}  */}
                  {teamChores.map((chore, idx) => (
                    <Card
                      key={idx}
                      className='chore-card-container'
                    >

                      <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}` }}>{chore.name}</Card.Body>

                    </Card>

                    // <MDBPopover trigger='hover' style={{ border: `2px solid ${team.dashboard_style}` }} className='chore-card' key={chore.pk} size='lg' color='black' placement='right' dismiss btnChildren={chore.name}>
                    //   <MDBPopoverHeader>{chore.detail}</MDBPopoverHeader>
                    //   <MDBPopoverBody>{chore.points}</MDBPopoverBody>
                    // </MDBPopover>
                  ))}
                </div>}
              {isCreating
                ? <Card>
                  <Card.Body>
                    <form onSubmit={(e) => handleCreate(e)}>
                      <label className='chore-detail' htmlFor='chore-title'>Chore Title</label>
                      <input type='text' id='chore-title' required value={choreName} onClick={event => setChoreName('')} onChange={evt => setChoreName(evt.target.value)} />
                      <label className='chore-detail' htmlFor='chore-detail'>Chore Detail</label>
                      <input style={{ width: '300px' }} type='textarea' id='chore-detail' required value={choreDetail} onClick={event => setChoreDetail('')} onChange={evt => setChoreDetail(evt.target.value)} />
                      <label className='chore-detail' htmlFor='point-detail'>Chore Point Value</label>
                      <input style={{ width: '50px', marginRight: '5px' }} type='number' id='point-value' required value={chorePoints} onChange={event => setChorePoints(event.target.value)} />
                      <button className='log-reg-button' type='submit'>Complete</button>
                    </form>
                  </Card.Body>
                  </Card>
                : <Card className='flex'>
                  {isCaptain
                    ? <Card.Body className='chore-card' style={{ border: '2px solid yellowgreen ', width: '150px' }}><span onClick={() => setIsCreating(true)}>Create a Chore</span></Card.Body>
                    : null}
                </Card>}
            </div>
            {teamChores.length > 0 &&
              <div className='flex-col'>
                <h2 style={{ paddingLeft: '20px', margin: '20px' }}>Chore Detail and Points</h2>
                <div style={{ marginLeft: '40px', marginRight: '40px' }} className='chore-detail-container'>
                  {teamChores.map((chore, idx) => (
                    <div className='flex' key={idx}>
                      <div className='chore-card' style={{ border: `2px solid ${team.dashboard_style}` }}>{chore.name}</div>
                      <div className='chore-card' style={{ textAlign: 'left', width: '50%', border: `2px solid ${team.dashboard_style}` }}>{chore.detail}</div>
                      <div className='chore-card' style={{ width: '10%', border: '2px solid yellowgreen' }}>{chore.points}</div>

                    </div>
                    // <MDBPopover trigger='hover' style={{ borderRadius: '10px', margin: '5px', border: `3px solid ${team.dashboard_style}`, color: 'white' }} key={chore.pk} size='lg' color='black' placement='right' dismiss btnChildren={chore.name}>
                    //   <MDBPopoverHeader>{chore.detail}</MDBPopoverHeader>
                    //   <MDBPopoverBody>{chore.points}</MDBPopoverBody>
                    // </MDBPopover>
                  ))}
                </div>
              </div>}

            {/* <div className='flex'>
              <div className='team-chore-mini' style={{ backgroundImage: `url(${team.background_image}` }}>
                <div className='team-title'>{team.name}!</div>
                <div className='team-slogan'>{team.slogan}!
                </div>
                <audio controls src={team.theme_song} />
              </div>
              <div className='team-scoreboard-container-dash' style={{ border: `3px solid ${team.dashboard_style}` }}>
                <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                  {team.members.map(member => (
                    <ScoreBoard team={team} member={member} key={member.username} />
                  ))}
                </div>
              </div>
              <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/chore-assignment/${team.pk}`}>Assign Chores</Link></button>
              <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/create-team-members/${myTeam}/${myTeamName}`}>Add Members</Link></button>
              <button style={{ color: 'white', border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'>Send Notification</button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamChoreDashboard
