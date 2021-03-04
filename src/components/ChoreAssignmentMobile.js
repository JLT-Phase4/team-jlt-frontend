import { useState, useEffect, useRef } from 'react'
import { getChores, getTeam, postAssigment, getAssignments, getUserProfile } from './../api'
import { useParams, Link } from 'react-router-dom'

function ChoreAssignmentMobile ({ token }) {
  const [team, setTeam] = useState()
  const [chores, setChores] = useState([])
  const [dragging, setDragging] = useState(false)
  const [assignment, setAssignment] = useState()
  const [assignments, setAssignments] = useState()
  const dragItem = useRef()
  const dropNode = useRef()
  const { teamPk } = useParams()
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [userProfiles, setUserProfiles] = useState([])

  useEffect(updateProfiles, [token, team])
  function updateProfiles () {
    // loop over ever member of team -- get userprofile and create --- member.profile//
    // make an array of user profiles and map over them // concat to userProfiles
    console.log('update profiles use effect happening')
    if (team) {
      let allUserProfiles = []
      for (const member of team.members) {
        getUserProfile(token, member.username).then(profile => {
          console.log(profile)
          allUserProfiles = allUserProfiles.concat(profile)
          console.log(allUserProfiles)
          setUserProfiles(allUserProfiles)
        }
        )
      }
    }
  }

  useEffect(updateChores, [token, teamPk])
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
        setChores(newChores)
      })
    }
    )
  }

  // useEffect(updateAssignments, [token])
  // function updateAssignments () {
  //   getAssignments(token).then(assignments => setAssignments(assignments)
  //   )
  // }

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
    dragItem.current = chore // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    console.log('what type is chore', typeof (chore))
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = chore.name + '???' + chore.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
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

  function handleDrop (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    console.log('this is the day param', day)
    const newData = document.createElement('div')
    const choreArray = data.split('???')
    newData.innerText = choreArray[0]
    const chorePk = choreArray[1]
    event.target.appendChild(newData)
    newData.setAttribute('draggable', true, 'onDragStart', '{(event) => { handleDragStart(event, { chore }) }},', 'onDragEnter', '{dragging ? (event) => { handleDragEnter(event, { chore }) } : null}')
    handleAssignChores(chorePk, member.username, day)
  }

  return (
    <div>
      <div>
        {userProfiles && chores && (
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
                  {userProfiles.map(member => (
                    <div className='team-member-container-list flex-row' key={member.username}>
                      <Link to={`/user-profile/${member.username}/`} className={member.username}>
                        {capitalizeUsername(member.username)}<br />
                        <div style={{ backgroundImage: `url(${member.avatar}`, width: '120px', height: '120px', backgroundSize: 'cover', borderRadius: '150px' }} />
                      </Link>
                      <div className='flex-row'>
                        {days.map(day => ( // does days need to be an object?
                          <div style={{ textAlign: 'center' }} key={day}>{day}
                            <div
                              className='drop-container'
                              id={day}
                              // onDrop={handleDrop({ day, member })}
                              onDrop={(event) => { handleDrop(event, { day, member }) }}
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

export default ChoreAssignmentMobile
