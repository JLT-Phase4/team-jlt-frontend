import { useState, useEffect, useRef } from 'react'
import { getChores, getTeam, postAssigment, deleteAssignment, updateAssignment } from '../api'
import { useParams, Link, Redirect } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { MDBPopover, MDBPopoverBody, MDBPopoverHeader } from 'mdb-react-ui-kit'

// import { getTargetProfiles } from './../helper/teamScreen'

function ChoreSummary ({ token, today, todayIndex }) {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [chores, setChores] = useState([])
  const [dragging, setDragging] = useState(false)
  // const [assignment, setAssignment] = useState()
  // const [assignments, setAssignments] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  const newData = useRef()
  const [isShowing, setIsShowing] = useState(false)
  // const { teamPk } = useParams()
  // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  // days.sort()

  useEffect(updateChores, [token, teamPk])
  function updateChores () {
    getTeam(token, teamPk).then(team => {
      // setTeam(team)
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

  // useEffect(updateTeam, [token, teamPk, setIsUpdating])
  useEffect(updateTeam, [token, teamPk, isUpdating])
  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  if (!token) {
    return <Redirect to='/login' />
  }

  function handleDragStart (event, { assignment, day, member }) {
    dragItem.current = assignment // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    // console.log('what type is chore', typeof (chore))
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = assignment.chore.name + '???' + 'ASSIGN' + '???' + assignment.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
    // window.scroll({
    //   top: 1000,
    //   left: 1000,
    //   behavior: 'smooth'
    // })
  }

  function handleDragStartCreate (event, { chore }) {
    dragItem.current = chore // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = chore.name + '???' + 'CHORE' + '???' + chore.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
    // window.scroll({
    //   top: 1000,
    //   left: 1000,
    //   behavior: 'smooth'
    // })
  }

  function handleDragEnd () {
    setDragging(false)
    dropNode.current.removeEventListener('dragend', handleDragEnd)
    dragItem.current = null
    dropNode.current = null
    newData.current = null
  }

  function handleDragOver (event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move' // make a copy instead of moving chore
  }

  function handleAssignmentUpdate (assignPk, status, member, day) {
    if (assignPk) {
      updateAssignment(token, assignPk, status, member, day).then(data => {
        setIsUpdating(false)
      }) // .then(updateProfiles())
    }
  }

  function handleAssignChores (chore, member, day) {
    // event.preventDefault()
    // const dayUpper = dayToUppercase(day)
    postAssigment(token, chore, member, day)
      .then(data => {
        setIsUpdating(false)
      })
  }

  function handleDeleteAssignment (assignPk) {
    deleteAssignment(token, assignPk)
      .then(response => {
        setIsUpdating(false)
      })
  }

  function handleDropOut (event) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    const assignmentArray = data.split('???')
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    // event.target.appendChild(newData)

    newData.setAttribute('draggable', true)
    setIsUpdating(true)
    // newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[2]
    handleDeleteAssignment(assignmentPk)
  }

  function handleDrop (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    const assignmentArray = data.split('???')
    const dropType = assignmentArray[1]
    // newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[2]
    // event.target.appendChild(newData)
    newData.setAttribute('draggable', true)
    setIsUpdating(true)
    if (dropType === 'CHORE') {
      handleAssignChores(assignmentPk, member.username, day)
    } else {
      handleAssignmentUpdate(assignmentPk, false, member.username, day)
    }
  }

  return (
    <div className='flex-col-center'>
      {team && chores && (
        <div>
          <div style={{ marginLeft: '20px', paddingLeft: '20px', width: '1400px' }} className='chore-list-container flex-col'>
            <h2><Link to={`/team-chores/${team.pk}`}>Chores</Link>
            </h2>
            <div className='flex'>
              {chores.map(chore => (
                <div key={chore.pk}>
                  <Card
                    draggable
                    onDragStart={(event) => { handleDragStartCreate(event, { chore }) }}
                    className='chore-card-container'
                  >
                    <Card.Body className='chore-card chore-card-main' style={{ width: '155px', border: `2px solid ${team.dashboard_style}` }}>
                      <MDBPopover data-mdb-trigger='hover' color='black' placement='right' dismiss btnChildren={<span>{chore.name}</span>}>
                        <MDBPopoverHeader style={{ backgroundColor: `${team.dashboard_style}`, color: 'white' }}>{chore.detail}</MDBPopoverHeader>
                        <MDBPopoverBody style={{ color: 'black' }}>{chore.points} points</MDBPopoverBody>
                      </MDBPopover>
                      {/* {chore.name} */}
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <h2 className='members'>Chore Assignments for <span style={{ color: `${team.dashboard_style}` }}>{team.name}</span></h2>
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='team-member-container flex-row'>
            <div>
              {team.members.map((member) => (
                <div key={member.pk} className='flex-nowrap'>
                  <div style={{ minWidth: '850px', width: '1150px' }} className='team-member-container-list'>
                    <Link style={{ fontSize: '22px', marginTop: '10px' }} to={`/user-profile/${member.username}/`} className={`${member.username} flex`}>
                      <div className='avatar-holder' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />
                      <span>{member.username}</span>

                      <span style={{ color: 'rgb(15, 82, 152)', fontSize: '22px', marginLeft: '5px' }}>{member.possible_chore_points.chore__points__sum} Points</span>
                    </Link>
                    <div className='flex-row'>
                      {days.map((day, index) => (
                        <div // className='drop-container'
                          id={day}
                          onDrop={(event) => { handleDrop(event, { day, member }) }}
                          onDragOver={handleDragOver} key={index} style={{ paddingBottom: '50px' }}
                        >
                          <Card className='chore-card-container'>
                            <Card.Body className='day-of-week-card'>
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
                                    className='chore-card-container'
                                  >
                                    {(assignment.complete === true)
                                      ? <Card.Body className='chore-card' style={{ color: 'white', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>

                                      // ? <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                      : <Card.Body className='chore-card' style={(index < todayIndex) ? { border: `2px solid ${team.dashboard_style}`, backgroundColor: '#e4e4e882' } : { border: `2px solid ${team.dashboard_style}` }}>{assignment.chore.name}</Card.Body>}
                                  </Card>
                                )}
                              </div>))}
                          </>
                        </div>
                      ))}

                    </div>
                  </div>

                  <div
                    onDrop={(event) => { handleDropOut(event) }}
                    onDragOver={handleDragOver}
                    className='team-member-container-list'
                  >
                    <Card className='chore-card-container'>
                      <Card.Body style={{ width: '120px' }} className='day-of-week-card'>
                        Delete
                      </Card.Body>
                    </Card>
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
