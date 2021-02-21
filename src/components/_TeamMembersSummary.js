import { Link } from 'react-router-dom'

const TeamMembersSummary = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div className='team-dashboard-container' style={{ height: `${displayHeight}`, backgroundImage: `url(${team.background_image}` }}>
          <div className='team-title'>We are team {team.name}!</div>
          <div className='team-slogan'>{team.slogan}!
            <audio controls style={{ width: '140px', height: '15px' }} src={team.theme_song} />
          </div>
          <div className='team-scoreblock'>
            {team.members.map(member => (
              <ul key={member}>
                <li><Link to={`/member/${member}/chores`}>{member}</Link></li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default TeamMembersSummary
