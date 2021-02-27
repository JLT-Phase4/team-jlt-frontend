import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getTeam, createChore, getChores } from './../api'
import { Card } from 'react-bootstrap'
import { Spring } from 'react-spring/renderprops'
import { MDBPopover, MDBPopoverBody, MDBPopoverHeader } from 'mdb-react-ui-kit'

const TeamChoreDashboard = ({ token, teams, myTeam, myTeamName }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [isCreating, setIsCreating] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [choreName, setChoreName] = useState('')
  const [choreDetail, setChoreDetail] = useState('')
  const [chorePoints, setChorePoints] = useState(1)
  const [chores, setChores] = useState([])
  const [teamChores, setTeamChores] = useState([])
  const [detailShown, setDetailShown] = useState({})
  // console.log(myTeam, myTeamName)
  const toggleDetail = (id) => {
    setDetailShown(prev => !prev[id] ? { ...prev, [id]: true } : { ...prev, [id]: false })
  }

  useEffect(updateTeam, [token, teamPk, myTeam, setIsCreating])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  useEffect(updateChores, [token, teamPk, isAdding, teamChores, setIsAdding, setIsCreating])

  function updateChores () {
    getChores(token).then(chores => setChores(chores))
  }

  useEffect(updateTeamChores, [token, teamPk, chores, isAdding, setIsAdding, setIsCreating])
  function updateTeamChores () {
    let newChores = []
    if (chores && team) {
      for (const chore of chores) {
        if (chore.team === team.name) {
          newChores = newChores.concat(chore)
        }
      }
      setTeamChores(newChores)
    }
  }

  // useEffect(handleCreate, [chores, team])
  function handleCreate (e) {
    e.preventDefault()
    if (team) {
      createChore(token, choreName, choreDetail, chorePoints, team.name).then(chore => updateTeamChores()).then(
        setIsCreating(false),
        setIsAdding(true)
      )
    }
  }

  return (
    <div>

      {(team && teamChores) && (

        <div>
          <div className='flex-col'>
            <h2 className='log-reg-header'>Chores for <span style={{ color: 'yellowgreen' }}>{team.name}</span></h2>
            <div style={{ marginLeft: '40px' }} className='flex'>
              {/* {teamChores.length > 0 &&
                <div>
                  {teamChores.map((chore) => (
                    <MDBPopover key={chore.pk} size='lg' color='danger' btnChildren='Click to toggle popover'>
                      <MDBPopoverHeader>{chore.name}</MDBPopoverHeader>
                      <MDBPopoverBody>{chore.points}</MDBPopoverBody>
                    </MDBPopover>

                  ))} */}
              {teamChores.length > 0 &&
                <div className='flex'>
                  {teamChores.map((chore) => (
                    <Card key={chore.pk} style={{ margin: '10px' }} className='flex'>
                      {chore ? <Card.Body onMouseOver={() => toggleDetail(chore.pk)} onMouseLeave={() => toggleDetail(chore.pk)}>{chore.name}</Card.Body> : null}
                      {detailShown[chore.pk]
                        ? <Card.Body style={{ backgroundColor: 'yellowgreen', color: 'black' }}>
                          {chore.detail} [{chore.points}] points
                          </Card.Body>
                        : null}
                    </Card>
                  ))}
                </div>}

              {isCreating
                ? <Card style={{ margin: '10px' }}>
                  <Card.Body>
                    <form onSubmit={(e) => handleCreate(e)}>
                      <label className='chore-detail' htmlFor='chore-title'>Chore Title</label>
                      <input type='text' id='chore-title' required value={choreName} onClick={event => setChoreName('')} onChange={evt => setChoreName(evt.target.value)} />
                      <label className='chore-detail' htmlFor='chore-detail'>Chore Detail</label>
                      <input type='textarea' id='chore-detail' required value={choreDetail} onClick={event => setChoreDetail('')} onChange={evt => setChoreDetail(evt.target.value)} />
                      <label className='point-detail' htmlFor='point-detail'>Chore Point Value</label>
                      <input type='number' id='point-value' required value={chorePoints} onChange={event => setChorePoints(event.target.value)} />
                      <button className='log-reg-button' type='submit'>Complete</button>
                    </form>
                  </Card.Body>
                  </Card>

                : <Card style={{ margin: '10px' }} className='flex'>
                  <Card.Body style={{ border: '2px solid yellowgreen ' }}><span onClick={() => setIsCreating(true)}>Create a Chore</span></Card.Body>
                </Card>}
            </div>

            <div className='flex'>
              <div className='team-chore-mini' style={{ backgroundImage: `url(${team.background_image}` }}>
                <div className='team-title'>{team.name}!</div>
                <div className='team-slogan'>{team.slogan}!
                  <audio controls style={{ width: '140px', height: '15px' }} src={team.theme_song} />
                </div>
              </div>
              <div className='team-scoreboard-container-dash' style={{ border: `3px solid ${team.dashboard_style}` }}>
                <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                  {team.members.map(member => (
                    <ul className='flex' key={member.username}>
                      <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div style={{ width: '40px', height: '40px', margin: '5px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: `url(${member.avatar})`, borderRadius: '100px' }} />{member.username}</Link></div>
                      <div style={{ backgroundColor: '#0e0e0eba', width: '50px', height: '20px', padding: '10px' }}>
                        <Spring
                          reset
                          config={{ duration: 3000 }}
                          from={{ backgroundColor: '#00ff00', height: '20px', width: '0px', padding: '10px', marginTop: '10px' }}
                          to={{ backgroundColor: '#00ff00', height: '20px', width: '50px', padding: '10px', marginTop: '10px' }}
                        >
                          {props => (
                            <div style={props} />
                          )}
                        </Spring>
                      </div>
                    </ul>
                  ))}
                </div>
              </div>
              <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/assign-chores/${team.pk}`}>Assign Chores</Link></button>
              <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/create-team-members/${myTeam}/${myTeamName}`}>Add Members</Link></button>
              <button style={{ color: 'white', border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'>Send Notification</button>

            </div>
          </div>

        </div>

      )}
    </div>
  )
}

export default TeamChoreDashboard
