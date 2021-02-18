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
    <MemberSummary team={team} displayHeight='vh100' />
    // <Nav???>
    // <TeamFeed></TeamFeed>
  )
}

export default TeamDashboard
