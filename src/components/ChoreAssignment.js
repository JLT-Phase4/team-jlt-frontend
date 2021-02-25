import { useState, useEffect } from 'react'
import { getTeam } from '../api'
import { useParams } from 'react-router-dom'

function ChoreAssignment ({ token }) {
  const [team, setTeam] = useState()

  const { teamPk } = useParams()
  const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday', 'Sunday']

  useEffect(getChores, [token, teamPk])

  function getChores () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  function capitalizeUsername (username) {
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

  return (
    <div>
      <div>
        {team && (
          <div>
            <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='chore-list-container flex-col'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Chores</span>
              <div className='flex'>
                {team.chores.map(chore => (
                  <ul key={chore}>
                    <li draggable>{chore}</li>
                  </ul>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='team-member-container flex-row'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Members</span>
              <div>
                {team.members.map(member => (
                  <div className='team-member-container-list flex-row' key={member.username}>
                    <div className='member'>
                      {capitalizeUsername(member.username)}<br />
                      <img src={member.avatar} style={{ maxHeight: '80px', maxWidth: '80px', borderRadius: '50px' }} />
                    </div>

                    <div className='flex-row'>
                      {Days.map(day => (
                        <div key={day}>
                          <div className='days'>
                            {day}
                            <div className='drop-container' placeholder='drop' />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ChoreAssignment
