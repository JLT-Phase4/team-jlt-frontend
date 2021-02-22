import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeam } from './../api'
// import useSound from 'use-sound'

// const TeamSongButton = ({ track }) => {
//   const [play] = useSound(track)
//   return <button onClick={play}>Team Song</button>
// }

const TeamDashboard = ({ token, username, today }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [isMember, setIsMember] = useState(false)

  useEffect(checkMember, [username, team, setIsMember, isMember])

  function checkMember () {
    if (team) {
      if (team.members.includes(username)) {
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
      {team ? (
        <>
          <div className='flex'>
            <div className='team-dashboard-container' style={{ height: '50%', backgroundImage: `url(${team.background_image}` }}>
              <div className='team-title'>We are {team.name}!</div>
              <div className='team-slogan'>{team.slogan}!
                {/* <TeamSongButton track={team.theme_song} /> */}
                <audio controls style={{ width: '140px', height: '15px' }} src={team.theme_song} />
              </div>
              <div className='team-scoreblock flex'>
                {team.members.map(member => (
                  <ul key={member}>
                    <li><Link to={`/member/${member}/chores`}>{member}</Link></li>
                  </ul>
                ))}
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
          </div>
          {isMember && <button className='team-dash-button'><Link to={`/member/${username}/${today}/chores`}>Track my chores</Link></button>}
        </>
      )
        : <>
          <div className='flex'>
            <div className='team-dashboard-container' style={{ height: '50%', backgroundColor: 'crimson' }}>
              <div className='team-title'>We team name!</div>
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
