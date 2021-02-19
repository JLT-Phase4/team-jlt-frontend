import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const DailyChoreDashboard = ({ members, chores, choreDays }) => {
  const { username } = useParams()
  const { day } = useParams()
  const [member, setMember] = useState()
  const [memberChores, setMemberChores] = useState()
  useEffect(updateTeam, [username])
  useEffect(updateChores, [username, day])

  function updateChores () {
    let newChores = []
    for (const chore of chores) {
      for (const newDay in chore.days) {
        if (chore.username === username && chore.days[newDay].day === day && chore.days[newDay].status === true) {
          newChores = newChores.concat(chore)
        }
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
      {(member && memberChores) && (

        <div className='member-dashboard-container'>
          <div style={{ width: '150px', height: '150px', borderRadius: '150px', backgroundSize: 'cover', backgroundImage: `url(${member.avatarUrl})` }} />
          <div className='team-title'>{username}'s page!</div>
          <div className='flex-sa'>
            <div className='team-scoreblock'>
              <div style={{ backgroundColor: 'white', color: 'black', fontSize: '22px', margin: '4px' }}>{day.toUpperCase()} Chores</div>
              {memberChores.map((chore, idx) => (
                <div style={{ fontSize: '25px', fontWeight: '600' }} key={idx}>{chore.chore_name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DailyChoreDashboard
