import { Link } from 'react-router-dom'

const MemberSummary = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div style={{ height: `${displayHeight}`, backgroundImage: `url(${team.logoUrl})` }} className='dashboard-container'>
          <div className='team-title'>We are team {team.name}!</div>
          <div className='team-scoreblock'>
            {team.members.map(member => (
              <ul key={member.username}>
                <li><Link to={`/member/${member.username}`}>{member.username}</Link></li>
                <li>{member.score}</li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MemberSummary
