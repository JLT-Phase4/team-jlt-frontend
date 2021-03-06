import { Link } from 'react-router-dom'
import ScoreBoard from './ScoreBoard'

const HomePageScoreCards = ({ teams, isCaptain, profileUsername }) => {
  return (
    <div className='home-header flex'>
      {teams.map((team, idx) => (
        <div key={idx}>
          {(team) && (
            <div className='team-scoreboard-container-home'>
              <Link to={`/team/${team.pk}`} style={{ fontSize: '25px', fontWeight: '600' }}>{team.name}</Link>
              {team.members.map(member => (
                <ScoreBoard team={team} member={member} key={member.username} />
              ))}
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
