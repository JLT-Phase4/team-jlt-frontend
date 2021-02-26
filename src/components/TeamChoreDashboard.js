import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getTeam, createChore, getChores } from './../api'
import { Card } from 'react-bootstrap'
import { Spring } from 'react-spring/renderprops'

const TeamChoreDashboard = ({ token }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [isCreating, setIsCreating] = useState(false)
  const [choreName, setChoreName] = useState('')
  const [choreDetail, setChoreDetail] = useState('')
  const [chorePoints, setChorePoints] = useState(3)
  const [chores, setChores] = useState([])
  const [teamChores, setTeamChores] = useState([])
  const [detailShown, setDetailShown] = useState({})

  const toggleDetail = (id) => {
    setDetailShown(prev => !prev[id] ? { ...prev, [id]: true } : { ...prev, [id]: false })
  }

  useEffect(updateTeam, [token, teamPk, setIsCreating])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  useEffect(updateChores, [token, setTeamChores])

  function updateChores () {
    getChores(token).then(chores => setChores(chores))
  }

  useEffect(updateTeamChores, [chores, team, setTeamChores, setIsCreating])
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

  useEffect(handleCreate, [chores, team, setIsCreating])
  function handleCreate () {
    // e.preventDefault()
    if (team) {
      createChore(token, choreName, choreDetail, chorePoints, team.name).then(chore => updateTeamChores())
    }
    setIsCreating(false)
  }

  return (
    <div>

      {(team && teamChores) && (

        <div>
          <div className='flex-col'>
            <h2 className='log-reg-header'>Chores for <span style={{ color: 'yellowgreen' }}>{team.name}</span></h2>
            <div style={{ marginLeft: '40px' }} className='flex'>

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

              {isCreating
                ? <Card style={{ margin: '10px' }}>
                  <Card.Body>
                    <form onSubmit={() => handleCreate()}>
                      <label className='chore-detail' htmlFor='chore-title'>Chore Title</label>
                      <input type='text' id='chore-title' required value={choreName} onClick={event => setChoreName('')} onChange={evt => setChoreName(evt.target.value)} />
                      <label className='chore-detail' htmlFor='chore-detail'>Chore Detail</label>
                      <input type='textarea' id='chore-detail' required value={choreDetail} onClick={event => setChoreDetail('')} onChange={evt => setChoreDetail(evt.target.value)} />
                      <button type='submit'>Complete</button>
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

            </div>
          </div>

        </div>

      )}
    </div>
  )
}

export default TeamChoreDashboard
