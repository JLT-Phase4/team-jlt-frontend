import { useState, useEffect, useRef } from 'react'
import { getChores, getTeam, postAssigment, getAssignments, getUserProfile, updateAssignment } from './../api'
import { useParams, Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

function ChoreSummary ({ token, today, todayIndex }) {
  const [team, setTeam] = useState()
  const [chores, setChores] = useState([])
  const [dragging, setDragging] = useState(false)
  const [assignment, setAssignment] = useState()
  const [assignments, setAssignments] = useState()
  const dragItem = useRef()
  const dropNode = useRef()
  const { teamPk } = useParams()
  // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

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
          // console.log(allUserProfiles)
          setUserProfiles(allUserProfiles)
          for (const profile of allUserProfiles) {
            let possiblePoints = 0
            console.log('type of assignments', typeof (profile.assignments))
            for (const assignment of profile.assignments) {
              possiblePoints += assignment.chore.points
            }
            console.log(possiblePoints)
            console.log('type of profile', typeof (profile))
            profile.possiblePoints = possiblePoints
            // profile = Object.assign({ possiblePoints: possiblePoints })
            console.log(allUserProfiles)
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

  function handleDragStart (event, { assignment }) {
    // console.log('drag is starting baby!', chore, chore.name, chore.pk)
    dragItem.current = assignment // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    // console.log('what type is chore', typeof (chore))
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = assignment.chore.name + '???' + assignment.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
    window.scroll({
      top: 1000,
      left: 1000,
      behavior: 'smooth'
    })
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
    event.dataTransfer.dropEffect = 'move' // make a copy instead of moving chore
  }

  function handleAssignChores (chore, member, day) {
    // event.preventDefault()
    // const dayUpper = dayToUppercase(day)
    console.log(chore, day, member)
    postAssigment(token, chore, member, day)
      .then((assignment) => setAssignment(assignment))
  }
  function handleAssignmentUpdate (assignPk, day, member) {
    if (assignPk) {
      updateAssignment(token, assignPk, false, member.username, day).then(updateProfiles())
    }
  }

  function handleDrop (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    console.log('this is the day param', day)
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    const assignmentArray = data.split('???')
    newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[1]
    event.target.appendChild(newData)
    newData.setAttribute('draggable', true, 'onDragStart', '{(event) => { handleDragStart(event, { chore }) }},', 'onDragEnter', '{dragging ? (event) => { handleDragEnter(event, { chore }) } : null}')
    // handleAssignChores(chorePk, member.username, day)
    handleAssignmentUpdate(assignmentPk, false, member, day)
    // here we would write a patch function that would update the assignemntpk to new member and/or day
  }

  return (
    <div>
      {userProfiles && chores && (
        <div>
          <div className='members' style={{ color: 'yellowgreen', fontSize: '25px' }}>Team Members</div>
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='team-member-container flex-row'>
            <div>
              {userProfiles.map((member) => (
                <div key={member.username} className='flex'>
                  <div style={{ minWidth: '950px' }} className='team-member-container-list flex-row'>
                    <Link to={`/user-profile/${member.username}/`} className={member.username}>
                      {member.username}<br />
                      <div style={{ backgroundImage: `url(${member.avatar}`, width: '120px', height: '120px', backgroundSize: 'cover', borderRadius: '150px' }} />
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
                                    onDragStart={(event) => { handleDragStart(event, { assignment }) }}
                                  >
                                    {(assignment.complete === true)
                                      ? <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
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
                    <div>Possible Points</div>
                    <div>{member.possiblePoints}</div>
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
