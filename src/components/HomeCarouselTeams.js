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
              <ul style={{ backgroundColor: 'black' }} className='flex' key={member}>
                <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member}/`}><div style={{ width: '40px', height: '40px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: "url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDQxMTN8MHwxfHNlYXJjaHw2fHxkb2d8ZW58MHx8fA&ixlib=rb-1.2.1&q=80&w=1080')", borderRadius: '100px' }} />{member}</Link></div>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default HomeCarouselTeams
