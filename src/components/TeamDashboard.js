import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MemberSummary from './MemberSummary'
import TeamFeed from './TeamFeed'
import fakeTeamDetail from './../fakeTeamDetail'

const TeamDashboard = () => {
  // const { teamPk } = useParams()  Use for api call

  return (
    <div>
      <TeamFeed team={fakeTeamDetail} />
      <MemberSummary team={fakeTeamDetail} displayHeight='50%' />
      <button className='team-dash-button'>Track my chores</button>
      {/* {if captain display button "send notifications"} */}
    </div>
  )
}

export default TeamDashboard
