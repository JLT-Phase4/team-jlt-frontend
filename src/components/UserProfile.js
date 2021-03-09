import { useState, useEffect, useRef } from 'react'
import { Card } from 'react-bootstrap'
import { useParams, Link, Redirect } from 'react-router-dom'
import { getTeam, getTeams, getUserProfile, updateUserProfile, updateAssignment, getPoints, getPointsByDay } from '../api'
import AvatarImage from './AvatarImage'
import ScoreBoard from './ScoreBoard'
import ScoreChart from './ScoreChart'

const UserProfile = ({ token, profileUsername, today, todayIndex, team, setTeam, teams, setTeams, podPk, updateTeamScores }) => {
  const { username } = useParams()
  const [userProfile, setUserProfile] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatingAssignment, setIsUpdatingAssignment] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [teamPk, setTeamPk] = useState('')
  const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  const newData = useRef()
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  useEffect(updateProfile, [token, today, username, isUpdating, isUpdatingAssignment, setAvatar])

  function updateProfile () {
    getUserProfile(token, username).then(profile => {
      let numberAssignments = 0
      let numberComplete = 0
      for (const assignment of profile.assignments) {
        if (assignment.assignment_type === today) {
          numberAssignments += 1
          if (assignment.complete) {
            numberComplete += 1
          }
        }
      }
      profile.numberAssignments = numberAssignments
      profile.numberComplete = numberComplete
      setUserProfile(profile)
      setTeamPk(profile.teams[0])
      if (profile.avatar !== null && profile.avatar !== undefined && profile.avatar !== '') {
        setAvatar(profile.avatar)
      } else {
        setAvatar(AVATAR)
      }
    })
  }

  function updateAvatar () {
    updateUserProfile(token, username, avatar).then(profile => setUserProfile(profile))
    setIsUpdating(false)
  }

  useEffect(handleAvatar, [token, userProfile])
  function handleAvatar () {
    if (isUpdating === false && userProfile) {
      setAvatar(userProfile.avatar)
    }
  }

  useEffect(updateTeam, [token, teamPk, isUpdatingAssignment, setAvatar, avatar])
  function updateTeam () {
    if (teamPk !== '') {
      getTeam(token, teamPk).then(team => {
        setTeam(team)
      })
    }
  }

  useEffect(updateTeams, [token, podPk, isUpdatingAssignment, setAvatar, avatar])
  function updateTeams () {
    if (podPk !== '') {
      getTeams(token, podPk).then(pod => {
        updateTeamScores(pod.teams)
        setTeams(pod.teams)
      })
    }
  }

  if (!token) {
    return <Redirect to='/login' />
  }

  function handleAssignmentUpdate (assignPk, status, profileUsername, day) {
    if (assignPk) {
      updateAssignment(token, assignPk, status, profileUsername, day).then(data => {
        setIsUpdatingAssignment(false)
        updateProfile()
      }
      )
    }
  }

  function handleDragStart (event, { assignment, today, userProfile }) {
    dragItem.current = assignment // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = assignment.chore.name + '???' + assignment.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
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

  function handleDropComplete (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    const assignmentArray = data.split('???')
    const assignmentPk = assignmentArray[1]
    newData.setAttribute('draggable', true)
    setIsUpdatingAssignment(true)
    handleAssignmentUpdate(assignmentPk, true, userProfile.username, today)
  }

  function handleDropInComplete (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    const assignmentArray = data.split('???')
    const assignmentPk = assignmentArray[1]
    newData.setAttribute('draggable', true)
    setIsUpdatingAssignment(true)
    handleAssignmentUpdate(assignmentPk, false, userProfile.username, today)
  }

  function titleCase (string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
  }

  return (
    <div>
      {userProfile && team && (
        <div className='flex-col-center'>
          <div className='flex-col'>
            <div style={{ marginTop: '20px', width: '1400px' }} className='flex-sb'>
              <div>
                <div className='avatar-image-profile' style={{ backgroundImage: `url(${avatar})` }} />
                <div style={{ marginTop: '20px' }} className='flex-col'>
                  <div style={{ fontSize: '30px', textAlign: 'center' }}>{userProfile.username}</div>
                  {/* <Link to='/'>Go to pod</Link> */}
                  {userProfile.username === profileUsername &&
                    <button onClick={() => setIsUpdating(true)} style={{ fontSize: '18px' }} className='log-reg-button'>Update Profile</button>}
                </div>
              </div>
              <div style={{ width: '600px' }} className='flex-col user-profile-mini-container'><span style={{ marginBottom: '30px', color: `${team.dashboard_style}`, fontSize: '24px' }}>Score Summary</span>
                <ScoreChart today={today} todayIndex={todayIndex} userProfile={userProfile} />
              </div>
              <div className='flex-col user-profile-mini-container'><Link to={`/team/${teamPk}`}><span style={{ color: `${team.dashboard_style}`, fontSize: '24px' }}>{team.name}</span> </Link>
                <div className='team-scoreblock flex-col'>
                  {team.members.map(member => (
                    <ScoreBoard team={team} member={member} key={member.username} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className=' member-dashboard-container'>

            {(!isUpdating)
              ? <div style={{ minWidth: '100%', width: '1400px' }}>
                <div className='flex'>
                  <div style={{ marginTop: '20px', marginBottom: '20px' }} className='flex-col'>
                    <div style={{ width: '1400px' }} className='flex-sb'>

                      <div
                        style={{ backgroundColor: '#ffffff12' }} className='flex user-profile-mini-container' id={today}
                        onDrop={(event) => { handleDropInComplete(event, { today, userProfile }) }}
                        onDragOver={handleDragOver}
                      >

                        {userProfile.assignments.length > 0 && userProfile.username === profileUsername
                          ? <div className='flex-sb'>
                            <div style={{ fontSize: '30px' }}>{titleCase(today)}'s Chores
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes(today) && assignment.complete === false) && (
                                    <Card
                                      draggable
                                      onDragStart={(event) => { handleDragStart(event, { assignment, today, userProfile }) }}
                                      className='chore-card-container'
                                    >
                                      <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}` }}>{assignment.chore.name}</Card.Body>
                                    </Card>)}
                                </div>))}
                            </div>
                            </div>

                          : <div className='flex-sb'>
                            <div style={{ fontSize: '30px' }}>{titleCase(today)}'s Chores
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes(today) && assignment.complete === false) && (
                                    <Card
                                      className='chore-card-container'
                                    >
                                      <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}` }}>{assignment.chore.name}</Card.Body>
                                    </Card>)}
                                </div>))}
                            </div>
                          </div>}
                      </div>
                      <div
                        style={{ backgroundColor: '#ffffff12' }} className='flex user-profile-mini-container' id={today}
                        onDrop={(event) => { handleDropComplete(event, { today, userProfile }) }}
                        onDragOver={handleDragOver}
                      >
                        {userProfile.assignments.length > 0 && userProfile.username === profileUsername
                          ? <div className='flex-sb'>
                            <div style={{ fontSize: '30px' }}>Drag to Mark Complete
                              {userProfile.assignments.map((assignment, idx) => (
                                <div
                                  key={idx}
                                >
                                  {((assignment.assignment_type.includes(today)) && assignment.complete === true) && (
                                    <Card
                                      draggable
                                      onDragStart={(event) => { handleDragStart(event, { assignment, today, userProfile }) }}
                                      className='chore-card-container'
                                    >
                                      <Card.Body className='chore-card' style={{ color: 'white', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>
                                    </Card>)}
                                </div>))}
                            </div>
                            </div>
                          : <div className='flex-sb'>
                            <div style={{ fontSize: '30px' }}>Drag to Mark Complete
                              {userProfile.assignments.map((assignment, idx) => (
                                <div
                                  key={idx}
                                >
                                  {((assignment.assignment_type.includes(today)) && assignment.complete === true) && (
                                    <Card
                                      className='chore-card-container'
                                    >
                                      <Card.Body className='chore-card' style={{ color: 'white', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>

                                      {/* <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body> */}
                                    </Card>)}
                                </div>))}
                            </div>
                          </div>}

                      </div>
                      {userProfile &&
                        <div
                          style={{ fontSize: '30px', backgroundColor: '#ffffff12' }} className='flex-col user-profile-mini-container'
                        >{titleCase(today)}'s Status
                          <div style={{ marginLeft: '50px', marginTop: '30px', fontSize: '30px' }}>
                            {userProfile.numberComplete} of {userProfile.numberAssignments} complete {userProfile.numberComplete === userProfile.numberAssignments && updateUserProfile.numberAssignments > 0 && <span style={{ fontSize: '40px', color: `${team.dashboard_style}` }} className='material-icons'>star</span>}
                          </div>
                        </div>}
                    </div>
                  </div>

                  {userProfile.assignments.length > 0
                    ? <div key={userProfile.pk} style={{ width: '1400px', minWidth: '850px' }} className='team-member-container-list flex-nowrap'>
                      <Link style={{ fontSize: '22px', marginTop: '10px' }} to={`/user-profile/${userProfile.username}/`} className={`${userProfile.username} flex`}>
                        <div>
                          <div className='avatar-holder-medium' style={(userProfile.avatar === undefined || userProfile.avatar === '' || userProfile.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${userProfile.avatar})` }} />
                          <div>{userProfile.username}</div>

                          <span style={{ color: `${team.dashboard_style}`, fontSize: '22px', marginLeft: '5px' }}>{userProfile.possible_chore_points.chore__points__sum} Points</span>
                        </div>
                      </Link>
                      <div className='flex-row'>
                        {days.map((day, index) => (
                          <div
                            key={index} style={{ paddingBottom: '50px' }}
                          >
                            <Card className='chore-card-container'>
                              <Card.Body className='day-of-week-card'>
                                {day}
                              </Card.Body>
                            </Card>
                            <>
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes(day)) && (
                                    <Card
                                      className='chore-card-container'
                                    >
                                      {(assignment.complete === true)
                                        ? <Card.Body className='chore-card' style={{ color: 'white', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>
                                        : <Card.Body className='chore-card' style={(index < todayIndex) ? { color: 'grey', border: `2px solid ${team.dashboard_style}`, backgroundColor: '#a7a7ad8c' } : { border: `2px solid ${team.dashboard_style}` }}>{assignment.chore.name}</Card.Body>}
                                    </Card>
                                  )}
                                </div>))}
                            </>
                          </div>
                        ))}

                      </div>

                    </div>

                    : null}
                </div>
                </div>
              : <div style={{ marginTop: '30px', marginBottom: '30px', height: '100vh' }} className='flex-col'>
                <AvatarImage token={token} setAvatar={setAvatar} />
                <button style={{ width: '150px' }} onClick={() => updateAvatar()} className='log-reg-button'>Done Updating</button>
                </div>}
          </div>
        </div>

      )}
    </div>

  )
}

export default UserProfile
