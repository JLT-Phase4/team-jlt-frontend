import { Link } from 'react-router-dom'

const CarouselMemberSummary = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div className='carousel-team-dashboard-container' style={{ height: `${displayHeight}`, backgroundImage: `url(${team.logoUrl}` }}>
          <div className='carousel-team-title'>We are team {team.name}!</div>
          <div className='carousel-team-scoreblock'>
            {team.members.map(member => (
              <ul key={member.username}>
                <li><Link to={`/member/${member.username}`}>{member.username}</Link> <br /> score: {member.score} </li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default CarouselMemberSummary
