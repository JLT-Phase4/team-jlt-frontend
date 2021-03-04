import { useState, useEffect, useRef } from 'react'
import { getChores, getTeam, postAssigment, getAssignments, getUserProfile, deleteAssignment, updateAssignment } from '../api'
import { useParams, Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
// import { getTargetProfiles } from './../helper/teamScreen'

function ChoreSummaryMobile ({ token, today, todayIndex }) {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'
  const { teamPk } = useParams()
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

  useEffect(updateTeam, [token, teamPk, isUpdating])
  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  function handleDragStart (event, { assignment, day, member }) {
    console.log('drag is starting baby!', assignment.pk, assignment.chore.name, day, member.username)
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
    console.log('drag is starting baby!', chore, chore.name, chore.pk)
    dragItem.current = chore // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    console.log('what type is chore', typeof (chore))
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

  function handleAssignChores (chore, member, day) {
    // event.preventDefault()
    // const dayUpper = dayToUppercase(day)
    console.log(chore, day, member)
    postAssigment(token, chore, member, day)
      .then(data => {
        setIsUpdating(false)
        console.log('here is the output from the post', data)
      })
  }

  function handleDeleteAssignment (assignPk) {
    deleteAssignment(token, assignPk)
      .then(response => {
        setIsUpdating(false)
        console.log('deleted assignment')
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
    console.log('handle Drop is firing')
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    console.log('this is the day param', day, member.username)
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    const assignmentArray = data.split('???')
    const dropType = assignmentArray[1]
    // newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[2]
    console.log('this is the drop zone where assignpk just landed', assignmentPk)
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
    <div>
      {team && chores && (
        <div>
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='flex-col'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Chores</span>
            <div className='flex'>
              {chores.map(chore => (
                <div key={chore.pk}>
                  <Card>
                    <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}` }}>{chore.name}</Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className='members' style={{ color: 'yellowgreen', fontSize: '25px' }}>Chore Assignments</div>
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }}>
            <div>
              <div className='flex-row'>
                {days.map((day, index) => (
                  <div key={day}>
                    <Card className='chore-card-container'>
                      <Card.Body className='day-of-week-card'>
                        {day}
                      </Card.Body>
                    </Card>
                    {team.members.map((member) => (

                      <div key={member.pk} className='flex'>

                        <div>
                          <Link style={{ fontSize: '22px', marginTop: '10px' }} to={`/user-profile/${member.username}/`} className={`${member.username} flex`}>
                            <div className='avatar-holder' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />
                            <span>{member.username}</span>

                            <span style={{ color: 'yellowgreen', fontSize: '22px', marginLeft: '5px' }}>{member.possible_chore_points.chore__points__sum} Points</span>
                          </Link>
                        </div>
                        <>
                          {member.assignments.map((assignment, idx) => (
                            <div key={idx}>
                              {(assignment.assignment_type.includes(day)) && (
                                <Card >
                                  {(assignment.complete === true)
                                    ? <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>

                                  // ? <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                    : <Card.Body className='chore-card' style={(index < todayIndex) ? { border: `2px solid ${team.dashboard_style}`, backgroundColor: '#e4e4e882' } : { border: `2px solid ${team.dashboard_style}` }}>{assignment.chore.name}</Card.Body>}
                                </Card>
                              )}
                            </div>))}
                        </>

                      </div>
                    ))}

                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>)}
    </div>

  )
}

export default ChoreSummaryMobile
