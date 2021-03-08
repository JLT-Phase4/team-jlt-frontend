import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScoreBoard from './ScoreBoard'
import { MDBProgress } from 'mdbreact'

const HomePageScoreCards = ({ token, teams, isCaptain, profileUsername }) => {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  return (
    <div style={{ minHeight: '40vh', overflow: 'scroll' }} className='home-header flex-nowrap'>
      {teams.map((team, idx) => (
        <div key={idx}>
          {(team) && (

            <div>
              <div style={{ height: '30vh' }} className='team-scoreboard-container-home'>
                <Link to={`/team/${team.pk}`} style={{ fontSize: '25px', fontWeight: '600' }}>{team.name}</Link>
                {team.members.map(member => (
                  <div key={member.username}>
                    <div style={{ fontSize: '21px', padding: '5px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div className='avatar-holder' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />{member.username}</Link></div>
                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='25px' value={100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum}>{(100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum).toFixed(1)}%</MDBProgress>
                  </div>
                  // <ScoreBoard team={team} member={member} key={member.username} />
                ))}
              </div>
              <div className='team-scoreboard-container-home'>Summary Data For Team
                <div>Total Points: {team.teamTotalPoints}</div>

              </div>
            </div>
          )}

        </div>
      ))}
      {/* {isCaptain
        ? <div>
          <button className='home-dash-button'><Link to='/create-team-dashboard'>Create a Team</Link></button>
          <button className='home-dash-button'><Link to='/create-team-dashboard'>Manage my Team</Link></button>
        </div>
        : <div>
          <button className='home-dash-button'><Link to={`/user-profile/${profileUsername}/`}>My Profile</Link></button>
          <button className='home-dash-button'><Link to='/create-team-dashboard'>Create a Team</Link></button>
        </div>} */}

    </div>
  )
}

export default HomePageScoreCards
