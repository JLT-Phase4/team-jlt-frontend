import { useState, useEffect } from 'react'
import { getTeam } from '../api'
import { useParams } from 'react-router-dom'

function ChoreAssignment ({ token }) {
  const [team, setTeam] = useState()

  const { teamPk } = useParams()

  useEffect(getChores, [token, teamPk])

  function getChores () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  return (
    <div>
      <div>
        {team && (
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='team-scoreblock flex-col'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Current Team Members</span>
            <div className='flex'>
              {team.members.map(member => (
                <ul key={member.username}>
                  <li>{member.username}</li>
                </ul>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ChoreAssignment
