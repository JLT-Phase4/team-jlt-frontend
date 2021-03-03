import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeam } from './../api'
import PodFeed from './PodFeed'
import ScoreBoard from './ScoreBoard'

const TeamDashboard = ({ token, profileUsername, today, myPod }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()

  useEffect(updateTeam, [token, teamPk, today, profileUsername])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {team &&
        (
          <>
            <div className='flex-center'>
              <div className='team-dashboard-container' style={{ backgroundImage: `url(${team.background_image}` }}>
                <div className='team-title'>{team.name}!</div>
                <div className='team-slogan'>{team.slogan}!
                </div>
                <audio controls src={team.theme_song} />
              </div>
              <div style={{ width: '100%', margin: '20px', justifyContent: 'space-between' }} className='flex'>
                <div style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: `${team.dashboard_style}` }} className='team-feed-container'>
                  {/* <h1>Feed will go here:</h1>
                  <ul>
                    <li>notifications</li>
                    <li>comments</li>
                    <li>emojis?</li>
                  </ul> */}
                  <PodFeed teamPk={teamPk} token={token} profileUsername={profileUsername} today={today} />
                </div>
                <div className='team-dashboard-scoreboard-container' style={{ border: `3px solid ${team.dashboard_style}` }}>
                  <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                    {team.members.length > 0
                      ? (
                        <div>
                          {team.members.map(member => (
                            <ScoreBoard team={team} member={member} key={member.username} />
                          ))}
                        </div>
                        )
                      : <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/create-team-members/${team.pk}/${team.name}`}>Add Team Members</Link></button>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default TeamDashboard
