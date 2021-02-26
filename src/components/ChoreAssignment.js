import { useState, useEffect, useRef } from 'react'
import { getTeam } from '../api'
import { useParams } from 'react-router-dom'

function ChoreAssignment ({ token }) {
  const [team, setTeam] = useState()
  const [assignment, setAssignment] = useState([])
  const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dragBox = useRef()
  const { teamPk } = useParams()
  const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday', 'Sunday']

  useEffect(getChores, [token, teamPk])

  function getChores () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  function capitalizeUsername (username) {
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

  function handleDragStart (event, params) {
    console.log('drag is starting baby!', params)
    dragItem.current = params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
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
                    <li
                      draggable
                      onDragStart={(event) => { handleDragStart(event, { chore }) }}
                    >{chore}
                    </li>
                  </ul>
                ))}
              </div>
            </div>
            <div>
              <div className='members' style={{ color: 'yellowgreen', fontSize: '25px' }}>Team Members</div>
              <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='team-member-container flex-row'>
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
          </div>
        )}

      </div>
    </div>
  )
}

export default ChoreAssignment
