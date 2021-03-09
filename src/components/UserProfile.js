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
  // const [team, setTeam] = useState()
  const [teamPk, setTeamPk] = useState('')
  const [showSummary, setShowSummary] = useState(true)
  const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  const newData = useRef()
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  useEffect(updateProfile, [token, username, isUpdating, isUpdatingAssignment, setAvatar])

  function updateProfile () {
    getUserProfile(token, username).then(profile => {
      setUserProfile(profile)
      setTeamPk(profile.teams[0])
      if (profile.avatar !== null && profile.avatar !== undefined && profile.avatar !== '') {
        setAvatar(profile.avatar)
      } else {
        setAvatar(AVATAR)
      }
    })
  }

  // let mondayScore = 0
  // let mondayPossible = 0
  // let tuesdayScore = 0
  // let tuesdayPossible = 0
  // let wednesdayScore = 0
  // let wednesdayPossible = 0
  // let thursdayScore = 0
  // let thursdayPossible = 0
  // let fridayScore = 0
  // let fridayPossible = 0
  // let saturdayScore = 0
  // let saturdayPossible = 0
  // let sundayScore = 0
  // let sundayPossible = 0

  // if (userProfile) {
  //   mondayScore = userProfile.monday_chore_points.chore__points__sum
  //   mondayPossible = userProfile.monday_possible_points.chore__points__sum
  //   tuesdayScore = mondayScore + userProfile.tuesday_chore_points.chore__points__sum
  //   tuesdayPossible = mondayPossible + userProfile.tuesday_possible_points.chore__points__sum
  //   wednesdayScore = tuesdayScore + userProfile.wednesday_chore_points.chore__points__sum
  //   wednesdayPossible = tuesdayPossible + userProfile.wednesday_possible_points.chore__points__sum
  //   thursdayScore = wednesdayScore + userProfile.thursday_chore_points.chore__points__sum
  //   thursdayPossible = wednesdayPossible + userProfile.thursday_possible_points.chore__points__sum
  //   fridayScore = thursdayScore + userProfile.friday_chore_points.chore__points__sum
  //   fridayPossible = thursdayPossible + userProfile.friday_possible_points.chore__points__sum
  //   saturdayScore = fridayScore + userProfile.saturday_chore_points.chore__points__sum
  //   saturdayPossible = fridayPossible + userProfile.saturday_possible_points.chore__points__sum
  //   sundayScore = saturdayScore + userProfile.sunday_chore_points.chore__points__sum
  //   sundayPossible = saturdayPossible + userProfile.sunday_possible_points.chore__points__sum
  // }

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

  function toggleSummary () {
    setShowSummary(!showSummary)
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
    // console.log('drag is starting baby!', assignment.pk, assignment.chore.name, today, userProfile.username)
    dragItem.current = assignment // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = assignment.chore.name + '???' + assignment.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
  }

  function handleDragEnd () {
    // console.log('drag ends when I release my mouse')
    setDragging(false)
    dropNode.current.removeEventListener('dragend', handleDragEnd)
    dragItem.current = null
    dropNode.current = null
    newData.current = null
  }

  function handleDragOver (event) {
    event.preventDefault()
    // console.log('handleDragOver is firing')
    event.dataTransfer.dropEffect = 'move' // make a copy instead of moving chore
  }

  function handleDropComplete (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    // console.log('this is the day param', member)
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    // console.log('this is the data transfer', data)
    const assignmentArray = data.split('???')
    // newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[1]
    // console.log('this is the drop zone where assignpk just landed', assignmentPk)
    // event.target.appendChild(newData)
    newData.setAttribute('draggable', true)
    setIsUpdatingAssignment(true)
    handleAssignmentUpdate(assignmentPk, true, userProfile.username, today)
  }

  function handleDropInComplete (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    // console.log('this is the day param', member)
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    // console.log('this is the data transfer', data)
    const assignmentArray = data.split('???')
    // newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[1]
    // console.log('this is the drop zone where assignpk just landed', assignmentPk)
    // event.target.appendChild(newData)
    newData.setAttribute('draggable', true)
    setIsUpdatingAssignment(true)
    handleAssignmentUpdate(assignmentPk, false, userProfile.username, today)
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
                  {userProfile.username === username &&
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
                            <div>{today}'s Chores
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
                            <div>{today}'s Chores
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
                            <div>Drag to Mark Complete
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
                            <div>Drag to Mark Complete
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
                          style={{ backgroundColor: '#ffffff12' }} className='flex user-profile-mini-container' id={today}
                          onDrop={(event) => { handleDropInComplete(event, { today, userProfile }) }}
                          onDragOver={handleDragOver}
                        >Summary of Some Kind
                        </div>}
                    </div>
                  </div>
                  {showSummary && userProfile.assignments.length > 0
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
                  {/* <div style={{ width: '100%', maxWidth: '1100px', border: `3px solid ${team.dashboard_style}`, backgroundColor: `${team.dashboard_style}` }} className='team-feed-container'>
                    {feedPk && (myTeam === teamPk) && (
                      <Feed token={token} profileUsername={profileUsername} today={today} feedPk={feedPk} />
                    )}
                    {/* add condition that userpfoile matches somehow */}
                  {/* </div> } */}
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
