import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const MemberDashboard = ({ users }) => {
  const { username } = useParams()
  const [user, setUser] = useState()
  useEffect(updateTeam, [username])
  function updateTeam () {
    for (const candidate of users) {
      if (candidate.username === username) {
        setUser(candidate)
      }
    }
  }
  return (
    <>
      {user && (

        <div className='dashboard-container'>
          <div style={{ width: '150px', height: '150px', borderRadius: '150px', backgroundSize: 'cover', backgroundImage: `url(${user.avatarUrl})` }} />
          <div className='team-title'>{username}'s page!</div>
          <div className='flex-sa'>
            <div className='team-scoreblock'>Daily
              {user.chores.map(chore => (
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
              {user.chores.map(chore => (
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
