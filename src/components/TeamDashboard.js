import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeam, postNotification } from './../api'
import PodFeed from './PodFeed'
import ScoreBoard from './ScoreBoard'

const TeamDashboard = ({ token, profileUsername, today, myPod }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [notPosted, setNotPosted] = useState(false)

  useEffect(updateTeam, [token, teamPk, today, profileUsername, notPosted])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  // const list = ['a', 'b', 'c']

  // for (const value of list) {
  //   console.log(value)
  //   if (value === 'b') {
  //     break
  //   }
  // }
  // if(prevState.data !== this.state.data)

  useEffect(updateNotifications, [token, today, notPosted])
  function updateNotifications () {
    if (team && notPosted) {
      console.log('I am in update notifications')
      for (const member of team.members) {
        console.log(member.possible_chore_points.chore__points__sum, member.earned_chore_points.chore__points__sum)
        if (member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum < 0.5) {
          console.log(member.username + 'has less than 50%')
          createNotifications(14, team.captain, member.pk, 'you are below 50%')
        }
      }
    }
  }

  function createNotifications (pod, sender, target, message) {
    postNotification(token, pod, sender, target, message).then((response) => {
      updateTeam()
      setNotPosted(false)
    }
    )
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
                  <PodFeed notPosted={notPosted} teamPk={teamPk} token={token} profileUsername={profileUsername} today={today} />
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
                {/* <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'>Send Notifications</button> */}

                <button onClick={() => setNotPosted(true)} style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'>Send Notifications</button>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default TeamDashboard
