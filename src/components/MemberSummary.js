import { Link } from 'react-router-dom'

const MemberSummary = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div className='team-dashboard-container' style={{ height: `${displayHeight}`, backgroundImage: `url(${team.background_image}` }}>
          <div className='team-title'>We are team {team.name}!</div>
          <div className='team-scoreblock'>
            {team.members.map(member => (
              <ul key={member}>
                <li>{member}</li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MemberSummary
