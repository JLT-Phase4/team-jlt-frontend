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
              <div style={{ backgroundColor: 'white', color: 'black', fontSize: '22px', margin: '4px' }}>Chores</div>
              {memberChores.map((chore, idx) => (
                <div style={{ fontSize: '25px', fontWeight: '600' }} key={idx}>{chore.chore_name}
                  {chore.days.map((day, idx) => (
                    <div key={idx}>{day.status === true && (<span style={{ fontSize: '18px', fontWeight: '300' }}>{day.day}</span>)}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChoreDashboard
