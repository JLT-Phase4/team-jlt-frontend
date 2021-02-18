import { useState, useEffect } from 'react'
import { Redirect, Link, useParams } from 'react-router-dom'

const TeamDashboard = ({ teams }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  console.log(teams)
  console.log(typeof (teamPk))
  useEffect(updateTeam, [teamPk])
  function updateTeam () {
    for (const candidate of teams) {
      console.log(typeof (candidate.teamPk))
      if (candidate.teamPk === teamPk) {
        setTeam(candidate)
      }
    }
  }

  return (
    <>
      {team && (
        <div style={{ height: '90vh' }}>We are team {team.name}!</div>

      )}
    </>
  )
}

export default TeamDashboard
