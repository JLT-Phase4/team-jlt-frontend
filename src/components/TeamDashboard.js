import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import TeamMembersSummary from './TeamMembersSummary'
import TeamFeed from './TeamFeed'
import { getTeam } from './../api'

const TeamDashboard = ({ token }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()

  useEffect(updateTeam, [token, teamPk])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }
  return (
    <div>
      <TeamFeed team={team} />
      <TeamMembersSummary team={team} displayHeight='50%' />
      <button className='team-dash-button'>Track my chores</button>
      {/* {if captain display button "send notifications"} */}
    </div>
  )
}

export default TeamDashboard
