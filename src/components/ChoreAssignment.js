import { useState, useEffect, useRef } from 'react'
import { getChores, getTeam, postAssigment } from './../api'
import { useParams } from 'react-router-dom'

function ChoreAssignment ({ token }) {
  const [team, setTeam] = useState()
  const [chores, setChores] = useState([])
  const [dragging, setDragging] = useState(false)
  const [assignment, setAssignment] = useState()
  const dragItem = useRef()
  const dropNode = useRef()
  const { teamPk } = useParams()
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [assignChore, setAssignChore] = useState('')
  const [assignDay, setAssignDay] = useState('')
  const [assignMember, setAssignMember] = useState('')
  const [assignmentPost, setAssignmentPost] = useState([])
  const [assignmentPosts, setAssignmentPosts] = useState({})

  useEffect(updateTeam, [token, teamPk])
  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  useEffect(updateChores, [token])
  function updateChores () {
    getTeam(token, teamPk).then(team => {
      setTeam(team)

      getChores(token).then(chores => {
        let newChores = []
        for (const chore of chores) {
          if (chore.team === team.name) {
            newChores = newChores.concat(chore)
          }
        }
        console.log(newChores)
        setChores(newChores)
      })
    }
    )
  }

  function handleAssignChores (chore, member, day) {
    // event.preventDefault()
    const dayUpper = dayToUppercase(day)
    console.log(chore, dayUpper, member)
    postAssigment(token, chore, member, dayUpper)
      .then((assignment) => setAssignment(assignment))
  }

  function capitalizeUsername (username) {
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

  function dayToUppercase (day) {
    return day.toUpperCase()
  }

  function handleDragStart (event, { chore }) {
    console.log('drag is starting baby!', chore, chore.name, chore.pk)
    dragItem.current = chore.pk // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    dropNode.current = event.target
    console.log(event.target.innerText)
    dropNode.current.addEventListener('dragend', handleDragEnd)
    // event.dataTransfer.setData('text/plain', event.target.innerText)
    event.dataTransfer.setData('text/plain', chore.pk) // this all works for the post now -- just need to get chore.name to be what is shown
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
  // function handleDrop (dayId, memberId) {
  //   return function (event) {
  //     func(event, dayId, memberId)
  //   }
  // }

  function handleDrop (event) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    const newData = document.createElement('div')
    newData.innerText = data
    event.target.appendChild(newData)
    console.log(newData)
    console.log(newData.parentElement.id)
    const dayId = newData.parentElement.id
    console.log(newData.parentElement.parentElement.parentElement.parentElement.firstElementChild.className)
    const memberId = newData.parentElement.parentElement.parentElement.parentElement.firstElementChild.className
    newData.setAttribute('draggable', true, 'onDragStart', '{(event) => { handleDragStart(event, { chore }) }},', 'onDragEnter', '{dragging ? (event) => { handleDragEnter(event, { chore }) } : null}')
    handleAssignChores(newData.innerText, memberId, dayId)
  }

  return (
    <div>
      <div>
        {team && chores && (
          <div>
            <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='chore-list-container flex-col'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Chores</span>
              <div className='flex'>
                {chores.map(chore => (
                  <ul key={chore.pk}>
                    <li
                      draggable
                      onDragStart={(event) => { handleDragStart(event, { chore }) }}
                    >{chore.name}
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
                      <div className={member.username}>
                        {capitalizeUsername(member.username)}<br />
                        <div style={{ backgroundImage: `url(${member.avatar}`, width: '120px', height: '120px', backgroundSize: 'cover', borderRadius: '150px' }} />
                      </div>

                      <div className='flex-row'>
                        {days.map(day => ( // does days need to be an object?
                          <div style={{ textAlign: 'center' }} key={day}>{day}
                            <div
                              className='drop-container'
                              id={day}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                            >
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
