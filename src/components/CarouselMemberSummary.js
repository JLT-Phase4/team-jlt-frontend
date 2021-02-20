import { Link } from 'react-router-dom'

const CarouselMemberSummary = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div className='carousel-team-dashboard-container' style={{ height: `${displayHeight}`, backgroundImage: `url(${team.background_image}` }}>
          <div className='carousel-team-title'>
            <Link to={`/team/${team.teamPk}`}>We are team {team.name}!</Link>
          </div>
          <div className='carousel-team-scoreblock'>
            {team.members.map(member => (
              <ul key={member}>
                <li>{member} </li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default CarouselMemberSummary
