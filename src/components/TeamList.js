import { useState, useEffect } from 'react'
import { Redirect, Link, useParams } from 'react-router-dom'
import fakeTeams from './../fakeTeams'

const TeamList = (props) => {
  const teams = fakeTeams
  return (
    <>
      {teams.map(team => (
        <div key={team.teamPk}>We are team <Link to={`/team/${team.teamPk}`}>{team.name}</Link></div>

      ))}
    </>
  )
}

export default TeamList
