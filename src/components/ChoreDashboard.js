import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ChoreDashboard = ({ members, chores }) => {
  const { username } = useParams()
  const [member, setMember] = useState()
  const [memberChores, setMemberChores] = useState()
  useEffect(updateTeam, [username])
  useEffect(updateChores, [username])

  function updateChores () {
    let newChores = []
    for (const chore of chores) {
      if (chore.username === username) {
        newChores = newChores.concat(chore)
      }
    }
    setMemberChores(newChores)
  }

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
            <div className='team-scoreblock'>
              <div style={{ backgroundColor: 'white', color: 'black', fontSize: '22px', margin: '4px' }}>Today</div>
              {memberChores.map((chore, idx) => (
                <div key={idx}>{chore.chore_name}
                  {chore.days.keys}
                  {/* {(chore.days.monday === true) && (<span>Hello</span>)} */}
                  {/* {chore.days.map((day, idx) => (
                    <div key={idx}>Hello{day.key}</div>
                  ))} */}
                  {/* <div><span style={{ fontSize: '22px' }}>{chore.chore_name}</span>
                      {chore.complete
                        ? <span className='material-icons'>check_box</span>
                        : <span className='material-icons'>check_box_outline_blank</span>}
                    </div> */}
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

export default ChoreDashboard
