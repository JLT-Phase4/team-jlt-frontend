import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeam } from './../api'
import { Spring } from 'react-spring/renderprops'

const TeamDashboard = ({ token, profileUsername, today }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [isMember, setIsMember] = useState(false)

  useEffect(checkMember, [profileUsername, team, setIsMember, isMember])

  function checkMember () {
    if (team) {
      if (team.members.includes(profileUsername)) {
        setIsMember(true)
      }
    }
  }

  useEffect(updateTeam, [token, teamPk])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {team
        ? (
          <>
            <div className='flex-center'>
              <div className='team-dashboard-container' style={{ backgroundImage: `url(${team.background_image}` }}>
                <div className='team-title'>{team.name}!</div>
                <div className='team-slogan'>{team.slogan}!
                  <audio controls style={{ width: '140px', height: '15px' }} src={team.theme_song} />
                </div>
              </div>
              <div style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: `${team.dashboard_style}` }} className='team-feed-container'>
                <h1>Feed will go here:</h1>
                <ul>
                  <li>notifications</li>
                  <li>comments</li>
                  <li>emojis?</li>
                </ul>
              </div>
              <div className='team-scoreboard-container' style={{ border: `3px solid ${team.dashboard_style}` }}>
                <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                  {team.members.map(member => (
                    <ul className='flex' key={member}>
                      <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member}/`}><div style={{ width: '40px', height: '40px', margin: '5px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: "url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDQxMTN8MHwxfHNlYXJjaHw2fHxkb2d8ZW58MHx8fA&ixlib=rb-1.2.1&q=80&w=1080')", borderRadius: '100px' }} />{member}</Link></div>
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
              {isMember && <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/member/${profileUsername}/${today}/chores`}>Track my chores</Link></button>}
              {(team.captain === profileUsername) && <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/create-team-members/${team.pk}/${team.name}`}>Add Team Members</Link></button>}
              {(team.captain === profileUsername) && <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/team-chores/${team.pk}/`}>Team Chore Dashboard</Link></button>}

            </div>
          </>
          )
        : <>
          <div className='flex'>
            <div className='team-dashboard-container' style={{ height: '50%', backgroundColor: 'crimson' }}>
              <div className='team-title'>Team name!</div>
              <div className='team-slogan'>Your slogan!
                <audio controls style={{ width: '140px', height: '15px' }} src='' />
              </div>
              <div className='team-scoreblock flex' />
            </div>
            <div style={{ border: '3px solid green', backgroundColor: 'green' }} className='team-feed-container'>
              <h1>Feed will go here:</h1>
              <ul />
            </div>
          </div>
          </>}
    </div>
  )
}

export default TeamDashboard
