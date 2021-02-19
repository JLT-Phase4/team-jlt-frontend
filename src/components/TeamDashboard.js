import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MemberSummary from './MemberSummary'

const TeamDashboard = ({ teams }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  useEffect(updateTeam, [teamPk])
  function updateTeam () {
    for (const candidate of teams) {
      if (candidate.teamPk === teamPk) {
        setTeam(candidate)
      }
    }
  }
  return (
    <div>
      <MemberSummary team={team} displayHeight='100vh' />
      <button className='team-dash-button'>Track my chores</button>
      {/* {if captain display button "send notifications"} */}
    </div>
  )
}

export default TeamDashboard
