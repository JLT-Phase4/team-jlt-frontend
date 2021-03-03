import { Link } from 'react-router-dom'
import { MDBProgress } from 'mdbreact'

const HomePageScoreCards = ({ teams, isCaptain, profileUsername }) => {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  return (
    <div className='home-header flex-sa'>
      {teams.map((team, idx) => (
        <div style={{ minWidth: '340px' }} key={idx}>
          {(team) && (
            <div className='team-scoreboard-container-home' style={{ border: `3px solid ${team.dashboard_style}` }}>
              <Link to={`/team/${team.pk}`} style={{ fontSize: '25px', fontWeight: '600' }}>{team.name}</Link>
              {/* <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'> */}
              {team.members.map(member => (
                <div key={member.username}>
                  <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div className='avatar-holder' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />{member.username}</Link></div>
                  <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum}>{(100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum).toFixed(1)}%</MDBProgress>
                </div>

              ))}
              {/* </div> */}
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
