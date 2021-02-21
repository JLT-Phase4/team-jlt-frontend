import { Link } from 'react-router-dom'
import { Spring } from 'react-spring/renderprops'

const _CarouselMemberSummary = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div className='carousel-team-dashboard-container' style={{ height: `${displayHeight}`, backgroundImage: `url(${team.logoUrl}` }}>
          <div className='carousel-team-title'>
            <Link to={`/team/${team.teamPk}`}>We are team {team.name}!</Link>
          </div>
          <div className='carousel-team-scoreblock'>
            {team.members.map(member => (
              <ul key={member.username}>
                <li>{member.username} <br /> summary: {member.summary} </li>
                <li>
                  <div style={{ backgroundColor: '#0e0e0eba', height: '20px', width: '105px' }}>
                    <Spring
                      reset
                      config={{ duration: 3000 }}
                      from={{ backgroundColor: '#00ff00', height: '20px', width: '0px' }}
                      to={{ backgroundColor: '#00ff00', height: '20px', width: `${member.summary * 100}px` }}

                    >
                      {props => (
                        <div style={props} />
                      )}
                    </Spring>
                  </div>

                </li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default _CarouselMemberSummary
