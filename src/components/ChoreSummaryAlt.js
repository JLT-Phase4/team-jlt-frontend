import { useState, useEffect, useRef } from 'react'
import { getChores, getTeam, postAssigment, getAssignments, getUserProfile, updateAssignment } from './../api'
import { useParams, Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
// import { getTargetProfiles } from './../helper/teamScreen'

function ChoreSummary ({ token, today, todayIndex, teamPk, teamView, username }) {
  const [team, setTeam] = useState()
  const [chores, setChores] = useState([])
  const [dragging, setDragging] = useState(false)
  const [assignment, setAssignment] = useState()
  const [assignments, setAssignments] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  const newData = useRef()
  // const { teamPk } = useParams()
  // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  // days.sort()

  console.log(teamPk, 'this is my team pk')
  const [userProfiles, setUserProfiles] = useState([])

  useEffect(updateProfiles, [token, team, isUpdating, username])
  function updateProfiles () {
    // loop over ever member of team -- get userprofile and create --- member.profile//
    // make an array of user profiles and map over them // concat to userProfiles
    console.log('update profiles use effect happening')
    // if (team) {
    //   getTargetProfiles((token, team, username, teamView, setUserProfiles))
    // }
    if (team) {
      let allUserProfiles = []
      if (teamView === true) {
        for (const member of team.members) {
          getUserProfile(token, member.username).then(profile => {
            allUserProfiles = allUserProfiles.concat(profile)
            for (const profile of allUserProfiles) {
              let possiblePoints = 0
              console.log('type of assignments', typeof (profile.assignments))
              for (const assignment of profile.assignments) {
                possiblePoints += assignment.chore.points
              }
              profile.possiblePoints = possiblePoints
              console.log('I am updating profiles')
            }
            setUserProfiles(allUserProfiles)
          }
          )
        }
      } else {
        getUserProfile(token, username).then(profile => {
          allUserProfiles = allUserProfiles.concat(profile)
          for (const profile of allUserProfiles) {
            let possiblePoints = 0
            console.log('type of assignments', typeof (profile.assignments))
            for (const assignment of profile.assignments) {
              possiblePoints += assignment.chore.points
            }
            profile.possiblePoints = possiblePoints
            console.log('I am updating profiles')
          }
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

  function handleDragStart (event, { assignment, day, member }) {
    console.log('drag is starting baby!', assignment.pk, assignment.chore.name, day, member.username)
    dragItem.current = assignment // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    // console.log('what type is chore', typeof (chore))
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = assignment.chore.name + '???' + assignment.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
    // window.scroll({
    //   top: 1000,
    //   left: 1000,
    //   behavior: 'smooth'
    // })
  }

  function handleDragEnd () {
    console.log('drag ends when I release my mouse')
    setDragging(false)
    dropNode.current.removeEventListener('dragend', handleDragEnd)
    dragItem.current = null
    dropNode.current = null
    newData.current = null
  }

  function handleDragOver (event) {
    event.preventDefault()
    console.log('handleDragOver is firing')
    event.dataTransfer.dropEffect = 'move' // make a copy instead of moving chore
  }

  function handleAssignmentUpdate (assignPk, status, member, day) {
    if (assignPk) {
      console.log(assignPk, status, day, member)
      updateAssignment(token, assignPk, status, member, day).then(data => {
        setIsUpdating(false)
        console.log('here is the output from patch', data)
      }) // .then(updateProfiles())
    }
  }

  function handleDrop (event, { day, member }) {
    event.preventDefault()
    console.log('handle Drop is firing')
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    console.log('this is the day param', day, member.username)
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    const assignmentArray = data.split('???')
    newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[1]
    console.log('this is the drop zone where assignpk just landed', assignmentPk)
    event.target.appendChild(newData)
    newData.setAttribute('draggable', true)
    setIsUpdating(true)
    handleAssignmentUpdate(assignmentPk, false, member.username, day)
    // here we would write a patch function that would update the assignemntpk to new member and/or day
  }

  return (
    <div>
      {userProfiles && chores && (
        <div>
          {/* <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='chore-list-container flex-col'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Chores</span>
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
          </div> */}

          <div className='members' style={{ color: 'yellowgreen', fontSize: '25px' }}>Chore Assignments</div>
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='team-member-container flex-row'>
            <div>
              {userProfiles.map((member) => (
                <div key={member.pk} className='flex'>
                  <div style={{ minWidth: '900px' }} className='team-member-container-list flex-row'>
                    <Link to={`/user-profile/${member.username}/`} className={member.username}>
                      {member.username}<br />
                      <div style={{ backgroundImage: `url(${member.avatar}`, width: '100px', height: '100px', backgroundSize: 'cover', borderRadius: '150px', marginRight: '10px' }} />
                    </Link>
                    <div className='flex-row'>
                      {days.map((day, index) => (
                        <div // className='drop-container'
                          id={day}
                      // onDrop={handleDrop({ day, member })}
                          onDrop={(event) => { handleDrop(event, { day, member }) }}
                          onDragOver={handleDragOver} key={index}
                        >
                          <Card style={{ width: '100%' }}>
                            <Card.Body style={{ fontWeight: '300', backgroundColor: 'black', border: '2px solid' }}>
                              {day}
                            </Card.Body>
                          </Card>
                          <>
                            {member.assignments.map((assignment, idx) => (
                              <div key={idx}>
                                {(assignment.assignment_type.includes(day)) && (
                                  <Card
                                    draggable
                                    onDragStart={(event) => { handleDragStart(event, { assignment, day, member }) }}
                                  >
                                    {(assignment.complete === true)
                                      ? <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>

                                      // ? <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                      : <Card.Body style={(index < todayIndex) ? { border: `2px solid ${team.dashboard_style}`, backgroundColor: '#e4e4e882', width: '100%' } : { border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>}
                                  </Card>
                                )}
                              </div>))}
                          </>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='team-member-container-list'>
                    <div>Points</div>
                    <div>? of {member.possiblePoints}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>)}
    </div>

  )
}

export default ChoreSummary
