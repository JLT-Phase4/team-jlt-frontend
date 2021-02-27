import { useState, useEffect, useRef } from 'react'
import { getTeam, postAssigment } from '../api'
import { useParams } from 'react-router-dom'

function ChoreAssignment ({ token }) {
  const [team, setTeam] = useState()
  const [assignment, setAssignment] = useState([])
  const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  const { teamPk } = useParams()
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(getChores, [token, teamPk])

  function getChores () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  function handleAssignChores (event, chore, username, assignmentType) {
    event.preventDefault()
    postAssigment(token, chore, username, assignmentType)
      .then((assignment) => setAssignment(assignment))
  }

  function capitalizeUsername (username) {
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

  function dayToUppercase (day) {
    return day.toUpperCase()
  }

  function handleDragStart (event, params) {
    console.log('drag is starting baby!', params)
    dragItem.current = params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    dropNode.current = event.target
    console.log(event.target.innerText)
    dropNode.current.addEventListener('dragend', handleDragEnd)
    event.dataTransfer.setData('text/plain', event.target.innerText)
    console.log(event.dataTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
    window.scroll({
      top: 1000,
      left: 1000,
      behavior: 'smooth'
    })
  }

  function handleDragEnter (event, params) {
    console.log('enter drag', params)
    const currentItem = dragItem.current
    if (event.target !== dropNode.current) {
      console.log('cool, this is not where I started dragging from, so I can drop here')
    }
  }

  function handleDragEnd () {
    console.log('drag ends when I release my mouse')
    setDragging(false)
    dropNode.current.removeEventListener('dragend', handleDragEnd)
    dragItem.current = null
    dropNode.current = null
  }

  function handleDragOver (event) {
    event.preventDefault()
    console.log('handleDragOver is firing')
    event.dataTransfer.dropEffect = 'copy' // make a copy instead of moving chore
  }
  function handleDrop (event) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    const newData = document.createElement('div')
    newData.innerText = data
    event.target.appendChild(newData)
    console.log(newData)
    // setAssignment(assignment)
    newData.setAttribute('draggable', true, 'onDragStart', '{(event) => { handleDragStart(event, { chore }) }},', 'onDragEnter', '{dragging ? (event) => { handleDragEnter(event, { chore }) } : null}')
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
                      // onDragEnter={dragging ? (event) => { handleDragEnter(event, { chore }) } : null}
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
                        <img src={member.avatar} style={{ maxWidth: '100%', borderRadius: '50px' }} />
                      </div>

                      <div className='flex-row'>
                        {days.map(day => ( // does days need to be an object?
                          <div key={day}>
                            <div
                              className='drop-container'
                              id={day}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                            >
                              {day}
                              {/* <div draggable className='appended-chores'>Chore</div> */}

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <button
                className='assign-chores-button'
                // onClick={(event) => handleAssignChores(event, {chore}, { username }, {dayToUppercase({id})}}
              >
                Assign Chores
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ChoreAssignment
