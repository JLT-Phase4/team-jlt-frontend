import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const TeamDashboard = ({ teams, showTeam }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [displayHeight, setDisplayHeight] = useState('100vh')
  useEffect(updateTeam, [teamPk])
  function updateTeam () {
    if (showTeam) {
      setTeam(showTeam)
      setDisplayHeight('65vh')
    } else {
      for (const candidate of teams) {
        if (candidate.teamPk === teamPk) {
          setTeam(candidate)
        }
      }
    }
  }
  return (
    <>
      {team && (
        <div style={{ height: `${displayHeight}`, backgroundImage: `url(${team.logoUrl})` }} className='dashboard-container'>
          <div className='team-title'>We are team {team.name}!</div>
          <div className='team-scoreblock'>
            {team.users.map(user => (
              <div key={user.username}>Member: {user.username} Score: {user.score} </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default TeamDashboard
