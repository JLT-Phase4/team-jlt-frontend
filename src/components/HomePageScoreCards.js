import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import { Spring } from 'react-spring/renderprops'

const outerDivStyle = {
  width: '80px',
  height: '105px',
  background: 'linear-gradient(#3a93eb, #052075)'
}

const HomePageScoreCards = ({ teams, isCaptain, profileUsername }) => {
  return (
    <div className='home-header flex-sa'>
      {teams.map((team, idx) => (
        <div style={{ minWidth: '340px' }} key={idx}>
          {(team) && (
            <div className='team-scoreboard-container-home' style={{ border: `3px solid ${team.dashboard_style}` }}>
              <Link to={`/team/${team.pk}`} style={{ fontSize: '25px', fontWeight: '600' }}>{team.name}</Link>
              {/* <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'> */}
              {team.members.map(member => (
                <ul className='flex' key={member.username}>
                  <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div style={{ width: '40px', height: '40px', margin: '5px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: `url(${member.avatar})`, borderRadius: '100px' }} />{member.username}</Link></div>
                  <div style={{ backgroundColor: '#0e0e0eba', width: '50px', height: '20px', padding: '10px' }}>
                    <Spring
                      reset
                      config={{ duration: 3000 }}
                      from={{ backgroundColor: '#00ff00', height: '20px', width: '0px', padding: '10px', marginTop: '10px' }}
                      to={{ backgroundColor: '#00ff00', height: '20px', width: '50px', padding: '10px', marginTop: '10px' }}
                    >
                      {props => (
                        <div style={props} />
                      )}
                    </Spring>
                  </div>
                </ul>
              ))}
              {/* </div> */}
            </div>
          // <Link to={`/team/${team.pk}`} className='flex-col'>
          //   <Card>
          //     <Card.Body style={{ backgroundColor: `${team.dashboard_style}` }} className='dashboard-style'>
          //       <div className='home-scorecard'>{team.name}
          //         <div style={outerDivStyle}>
          //           <Spring
          //             reset
          //             config={{ duration: 3000 }}
          //             from={{ height: '105px', width: '80px', backgroundColor: '#0e0e0e' }}
          //             to={{ height: `${105 - 0.7 * 100}px`, width: '80px', backgroundColor: '#0e0e0e' }}
          //           >
          //             {/* height in the 'to' will ultimately be dynamic with 0.7 set as team percentage */}
          //             {props => (
          //               <div style={props} />
          //             )}
          //           </Spring>
          //         </div>
          //       </div>
          //     </Card.Body>
          //   </Card>
          // </Link>
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
