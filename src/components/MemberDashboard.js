import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const MemberDashboard = ({ members }) => {
  const { username } = useParams()
  const [member, setMember] = useState()
  useEffect(updateTeam, [username])
  function updateTeam () {
    for (const candidate of members) {
      if (candidate.username === username) {
        setMember(candidate)
      }
    }
  }
  return (
    <>
      {member && (

        <div className='member-dashboard-container'>
          <div style={{ width: '150px', height: '150px', borderRadius: '150px', backgroundSize: 'cover', backgroundImage: `url(${member.avatarUrl})` }} />
          <div className='team-title'>{username}'s page!</div>
          <div className='flex-sa'>
            <div className='team-scoreblock'>Daily
              {member.chores.map(chore => (
                <div key={chore.name}>
                  {(chore.type === 'daily') && (
                    <div>{chore.name}
                      {chore.complete
                        ? <span className='material-icons'>check_box</span>
                        : <span className='material-icons'>check_box_outline_blank</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className='team-scoreblock'>Weekly
              {member.chores.map(chore => (
                <div key={chore.name}>
                  {(chore.type === 'weekly') && (
                    <div>{chore.name}
                      {chore.complete
                        ? <span className='material-icons'>check_box</span>
                        : <span className='material-icons'>check_box_outline_blank</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  // <Nav???>
    // <TeamFeed></TeamFeed>
  )
}

export default MemberDashboard
