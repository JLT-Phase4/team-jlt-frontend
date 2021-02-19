import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const MemberDashboard = ({ members, choreDays }) => {
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
          <Link to={`/member/chores/${username}`}>See chore detail for {username}</Link>
          {/* <Link to={`/member/chores/monday/${username}`}>Chore detail for Monday</Link> */}
          <div className='flex'>
            {choreDays.map(day => (
              <Link style={{ marginRight: '5px', marginLeft: '5px' }} key={day} to={`/member/chores/${day}/${username}`}>{day.toUpperCase()}</Link>
            ))}
          </div>
          <div className='flex-sa'>
            <div className='team-scoreblock'>
              <div style={{ backgroundColor: 'white', color: 'black', fontSize: '22px', margin: '4px' }}>Today</div>
              {member.chores.map(chore => (
                <div key={chore.name}>
                  {(chore.type === 'daily') && (
                    <div><span style={{ fontSize: '22px' }}>{chore.name}</span>
                      {chore.complete
                        ? <span className='material-icons'>check_box</span>
                        : <span className='material-icons'>check_box_outline_blank</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className='team-scoreblock'>
              <div style={{ backgroundColor: 'white', color: 'black', fontSize: '22px', margin: '4px' }}>This Week</div>
              {member.chores.map(chore => (
                <div key={chore.name}>
                  {(chore.type === 'weekly') && (
                    <div><span style={{ fontSize: '22px' }}>{chore.name}</span>
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
