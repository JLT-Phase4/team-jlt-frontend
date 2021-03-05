import { useState, useEffect, useRef } from 'react'
import { Card } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { getTeam, getUserProfile, updateUserProfile, updateAssignment, getPoints, getPointsByDay } from '../api'
import AvatarImage from './AvatarImage'
import { MDBProgress, MDBContainer } from 'mdbreact'
import { Line } from 'react-chartjs-2'
import ScoreBoard from './ScoreBoard'
import ScoreChart from './ScoreChart'
import Feed from './Feed'

const UserProfile = ({ token, profileUsername, today, todayIndex, feedPk, myTeam }) => {
  const { username } = useParams()
  const [userProfile, setUserProfile] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatingAssignment, setIsUpdatingAssignment] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [team, setTeam] = useState()
  const [teamPk, setTeamPk] = useState('')
  const [showSummary, setShowSummary] = useState(true)
  const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  const newData = useRef()
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  useEffect(updateProfile, [token, username, isUpdating, isUpdatingAssignment, feedPk])

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

  let mondayScore = 0
  let mondayPossible = 0
  let tuesdayScore = 0
  let tuesdayPossible = 0
  let wednesdayScore = 0
  let wednesdayPossible = 0
  let thursdayScore = 0
  let thursdayPossible = 0
  let fridayScore = 0
  let fridayPossible = 0
  let saturdayScore = 0
  let saturdayPossible = 0
  let sundayScore = 0
  let sundayPossible = 0

  if (userProfile) {
    mondayScore = userProfile.monday_chore_points.chore__points__sum
    mondayPossible = userProfile.monday_possible_points.chore__points__sum
    tuesdayScore = mondayScore + userProfile.tuesday_chore_points.chore__points__sum
    tuesdayPossible = mondayPossible + userProfile.tuesday_possible_points.chore__points__sum
    wednesdayScore = tuesdayScore + userProfile.wednesday_chore_points.chore__points__sum
    wednesdayPossible = tuesdayPossible + userProfile.wednesday_possible_points.chore__points__sum
    thursdayScore = wednesdayScore + userProfile.thursday_chore_points.chore__points__sum
    thursdayPossible = wednesdayPossible + userProfile.thursday_possible_points.chore__points__sum
    fridayScore = thursdayScore + userProfile.friday_chore_points.chore__points__sum
    fridayPossible = thursdayPossible + userProfile.friday_possible_points.chore__points__sum
    saturdayScore = fridayScore + userProfile.saturday_chore_points.chore__points__sum
    saturdayPossible = fridayPossible + userProfile.saturday_possible_points.chore__points__sum
    sundayScore = saturdayScore + userProfile.sunday_chore_points.chore__points__sum
    sundayPossible = saturdayPossible + userProfile.sunday_possible_points.chore__points__sum
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

  useEffect(updateTeam, [token, teamPk, isUpdatingAssignment])
  function updateTeam () {
    if (teamPk !== '') {
      getTeam(token, teamPk).then(team => setTeam(team))
    }
  }

  function toggleSummary () {
    setShowSummary(!showSummary)
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
    console.log('drag is starting baby!', assignment.pk, assignment.chore.name, today, userProfile.username)
    dragItem.current = assignment // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = assignment.chore.name + '???' + assignment.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
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

  function handleDropComplete (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    console.log('this is the day param', member)
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    console.log('this is the data transfer', data)
    const assignmentArray = data.split('???')
    // newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[1]
    console.log('this is the drop zone where assignpk just landed', assignmentPk)
    // event.target.appendChild(newData)
    newData.setAttribute('draggable', true)
    setIsUpdatingAssignment(true)
    handleAssignmentUpdate(assignmentPk, true, userProfile.username, today)
  }

  function handleDropInComplete (event, { day, member }) {
    event.preventDefault()
    const data = event.dataTransfer.getData('text/plain') // Get the id of the target and add the moved element to the target's DOM
    console.log('this is the day param', member)
    const newData = document.createElement('div')
    newData.className = 'chore-card'
    console.log('this is the data transfer', data)
    const assignmentArray = data.split('???')
    // newData.innerText = assignmentArray[0]
    const assignmentPk = assignmentArray[1]
    console.log('this is the drop zone where assignpk just landed', assignmentPk)
    // event.target.appendChild(newData)
    newData.setAttribute('draggable', true)
    setIsUpdatingAssignment(true)
    handleAssignmentUpdate(assignmentPk, false, userProfile.username, today)
  }

  return (
    <div>
      {userProfile && team && (
        <>
          <div className='flex-col'>
            <div style={{ maxWidth: '1250px', marginTop: '100px', marginLeft: '45px', marginRight: '45px' }} className='flex'>
              <div>
                <div className='avatar-image' style={{ backgroundImage: `url(${avatar})` }} />
                <div style={{ marginTop: '30px' }} className='flex-col team-title'>{userProfile.username}'s page!
                  <button onClick={() => setIsUpdating(true)} style={{ fontSize: '18px' }} className='log-reg-button'>Update Profile</button>
                </div>
              </div>
              <div className='flex-col user-profile-mini-container'><span style={{ color: 'yellowgreen', fontSize: '24px' }}>Score Summary</span>
                <ScoreChart today={today} todayIndex={todayIndex} userProfile={userProfile} />

                <div>Total</div>
                <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.earned_chore_points.chore__points__sum / userProfile.possible_chore_points.chore__points__sum}>{(100 * userProfile.earned_chore_points.chore__points__sum / userProfile.possible_chore_points.chore__points__sum).toFixed(1)}%</MDBProgress>
                <div>Monday</div>
                {/* <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * mondayScore / mondayPossible} /> */}

                <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.monday_chore_points.chore__points__sum / userProfile.monday_possible_points.chore__points__sum} />
                {todayIndex >= 1 && (
                  <>
                    <div>Tuesday</div>
                    {/* <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * tuesdayScore / tuesdayPossible} /> */}

                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.tuesday_chore_points.chore__points__sum / userProfile.tuesday_possible_points.chore__points__sum} />
                  </>)}
                {todayIndex >= 2 && (
                  <>
                    <div>Wednesday</div>
                    {/* <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * wednesdayScore / wednesdayPossible} /> */}

                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.wednesday_chore_points.chore__points__sum / userProfile.wednesday_possible_points.chore__points__sum} />
                  </>)}
                {todayIndex >= 3 && (
                  <>
                    <div>Thursday</div>
                    {/* <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * thursdayScore / thursdayPossible} /> */}

                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.thursday_chore_points.chore__points__sum / userProfile.thursday_possible_points.chore__points__sum} />
                  </>)}
                {todayIndex >= 4 && (
                  <>
                    <div>Friday</div>
                    {/* <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * fridayScore / fridayPossible} /> */}

                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.friday_chore_points.chore__points__sum / userProfile.friday_possible_points.chore__points__sum} />
                  </>)}
                {todayIndex >= 5 && (
                  <>
                    <div>Saturday</div>
                    {/* <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * saturdayScore / saturdayPossible} /> */}

                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.saturday_chore_points.chore__points__sum / userProfile.saturday_possible_points.chore__points__sum} />
                  </>)}
                {todayIndex >= 6 && (
                  <>
                    <div>Sunday</div>
                    {/* <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * sundayScore / sundayPossible} /> */}

                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * userProfile.sunday_chore_points.chore__points__sum / userProfile.sunday_possible_points.chore__points__sum} />
                  </>)}
              </div>
              <div className='flex-col user-profile-mini-container'><Link to={`/team/${teamPk}`}><span style={{ color: 'yellowgreen', fontSize: '24px' }}>{team.name}</span> </Link>
                <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                  {team.members.map(member => (
                    <ScoreBoard team={team} member={member} key={member.username} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className=' member-dashboard-container'>

            {(!isUpdating)
              ? <div style={{ minWidth: '100%' }}>
                <div className='flex-center'>
                  <div style={{ }} className='flex-col'>
                    <div style={{ marginTop: '50px', marginLeft: '45px', fontSize: '25px', marginBottom: '20px' }}>Drag Chores to Mark Them Complete</div>
                    <div style={{ maxWidth: '900px' }} className='flex-sa'>
                      <div
                        className='flex user-profile-mini-container' id={today}
                        onDrop={(event) => { handleDropInComplete(event, { today, userProfile }) }}
                        onDragOver={handleDragOver}
                      >
                        {userProfile.assignments.length > 0 && (
                          <div className='flex-sb'>
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
                        )}
                      </div>
                      <div
                        className='flex user-profile-mini-container' id={today}
                        onDrop={(event) => { handleDropComplete(event, { today, userProfile }) }}
                        onDragOver={handleDragOver}
                      >
                        {userProfile.assignments.length > 0 && (
                          <div className='flex-sb'>
                            <div>Complete
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
                                      <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>

                                      {/* <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body> */}
                                    </Card>)}
                                </div>))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {showSummary && userProfile.assignments.length > 0
                    ? <div key={userProfile.pk} style={{ marginLeft: '50px', minWidth: '850px', maxWidth: '1100px' }} className='team-member-container-list flex-nowrap'>
                      <Link style={{ fontSize: '22px', marginTop: '10px' }} to={`/user-profile/${userProfile.username}/`} className={`${userProfile.username} flex`}>
                        <div className='avatar-holder' style={(userProfile.avatar === undefined || userProfile.avatar === '' || userProfile.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${userProfile.avatar})` }} />
                        <span>{userProfile.username}</span>

                        <span style={{ color: 'yellowgreen', fontSize: '22px', marginLeft: '5px' }}>{userProfile.possible_chore_points.chore__points__sum} Points</span>
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
                                        ? <Card.Body className='chore-card' style={{ border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}</Card.Body>
                                        : <Card.Body className='chore-card' style={(index < todayIndex) ? { border: `2px solid ${team.dashboard_style}`, backgroundColor: '#e4e4e882' } : { border: `2px solid ${team.dashboard_style}` }}>{assignment.chore.name}</Card.Body>}
                                    </Card>
                                  )}
                                </div>))}
                            </>
                          </div>
                        ))}

                      </div>

                    </div>

                    : <div onClick={() => toggleSummary()} className='flex-col-center' style={{ fontSize: '25px', color: 'yellowgreen', marginBottom: '20px', marginTop: '50px' }}>Show Summary</div>}
                  {/* <div style={{ width: '100%', maxWidth: '1100px', border: `3px solid ${team.dashboard_style}`, backgroundColor: `${team.dashboard_style}` }} className='team-feed-container'>
                    {feedPk && (myTeam === teamPk) && (
                      <Feed token={token} profileUsername={profileUsername} today={today} feedPk={feedPk} />
                    )}
                    {/* add condition that userpfoile matches somehow */}
                  {/* </div> } */}
                </div>
                </div>
              : <div style={{ marginTop: '30px', marginBottom: '30px', height: '100vh', alignItems: 'center' }} className='flex-col'>
                <AvatarImage token={token} setAvatar={setAvatar} />
                <button onClick={() => updateAvatar()} className='home-dash-button'>Done Updating</button>
                </div>}
          </div>
        </>

      )}
    </div>

  )
}

export default UserProfile
