import { Link } from 'react-router-dom'

const HomeCarouselTeams = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div className='carousel-team-dashboard-container' style={{ height: `${displayHeight}`, backgroundImage: `url(${team.background_image}` }}>
          <div className='carousel-team-title'>
            <Link to={`/team/${team.pk}`}>{team.name}!</Link>
          </div>
          <div className='carousel-team-scoreblock flex-col'>
            {team.members.map(member => (
              <ul style={{ backgroundColor: 'black' }} className='flex' key={member.username}>
                <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div style={{ width: '40px', height: '40px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: `url(${member.avatar})`, borderRadius: '100px' }} />{member.username}</Link></div>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default HomeCarouselTeams
