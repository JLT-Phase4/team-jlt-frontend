import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MemberSummary from './MemberSummary'
import TeamFeed from './TeamFeed'
import fakeTeamDetail from './../fakeTeamDetail'
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
      <MemberSummary team={team} displayHeight='50%' />
      <button className='team-dash-button'>Track my chores</button>
      {/* {if captain display button "send notifications"} */}
    </div>
  )
}

export default TeamDashboard
