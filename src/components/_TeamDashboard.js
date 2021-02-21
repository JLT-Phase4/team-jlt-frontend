import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MemberSummary from './MemberSummary'
import TeamFeed from './_TeamFeed'

const _TeamDashboard = ({ teams }) => {
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
      <TeamFeed team={team} />
      <MemberSummary team={team} displayHeight='50%' />
      <button className='team-dash-button'>Track my chores</button>
      {/* {if captain display button "send notifications"} */}
    </div>
  )
}

export default _TeamDashboard
