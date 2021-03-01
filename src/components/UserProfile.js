import { useState, useEffect, useRef } from 'react'
import { Card } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { getTeam, getUserProfile, updateUserProfile, updateAssignment, getPoints } from '../api'
import AvatarImage from './AvatarImage'
import { Spring } from 'react-spring/renderprops'
import { MDBProgress } from 'mdbreact'
import ChoreSummary from './ChoreSummary'

const UserProfile = ({ token, profileUsername, today, todayIndex }) => {
  const { username } = useParams()
  const [userProfile, setUserProfile] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatingAssignment, setIsUpdatingAssignment] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [team, setTeam] = useState()
  const [teamPk, setTeamPk] = useState('')
  const [myAssignments, setMyAssignments] = useState()
  const [showSummary, setShowSummary] = useState(true)
  const [points, setPoints] = useState(0)
  const [myPossiblePoints, setMyPossiblePoints] = useState()
  const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  const newData = useRef()

  useEffect(updateProfile, [token, username, isUpdating, setPoints, isUpdatingAssignment])

  function updateProfile () {
    getUserProfile(token, username).then(profile => {
      setUserProfile(profile)
      setTeamPk(profile.teams[0])
      const userAssignments = []
      if (profile) {
        for (const assignment of profile.assignments) {
          if (!userAssignments.includes(assignment)) {
            userAssignments.push(assignment)
          }
        }
        setMyAssignments(userAssignments)
        let possiblePoints = 0
        for (const assignment of userAssignments) {
          possiblePoints += assignment.chore.points
        }
        setMyPossiblePoints(possiblePoints)
      }
    })
  }

  useEffect(updatePoints, [token, username, setMyAssignments, myAssignments])
  function updatePoints () {
    getPoints(token, username).then(points => setPoints(points))
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

  useEffect(updateTeam, [token, teamPk])
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
    window.scroll({
      top: 1000,
      left: 1000,
      behavior: 'smooth'
    })
  }

  function handleDragEnd () {
    console.log('drag ends when I release my mouse')
    setDragging(false)
    // setIsUpdatingAssignment(false)
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
      {userProfile && team && myAssignments && points && (
        <>
          <div className='flex-col'>
            <div style={{ maxWidth: '1250px', marginTop: '100px', marginLeft: '45px', marginRight: '45px' }} className='flex'>
              <div className='avatar-image' style={{ backgroundImage: `url(${avatar})` }} />
              <div style={{ marginTop: '30px' }} className='flex-col team-title'>{userProfile.username}'s page!
                <button onClick={() => setIsUpdating(true)} style={{ fontSize: '18px' }} className='log-reg-button'>Update Profile</button>
              </div>
              <div className='flex-col user-profile-mini-container'>Score Summary
                <>
                  {(points.chore__points__sum !== null) && points.chore__points__sum !== '' &&
                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}`, marginTop: '30px' }} marginTop='30px' height='30px' value={100 * parseInt(points.chore__points__sum) / myPossiblePoints}>{(100 * parseInt(points.chore__points__sum) / myPossiblePoints).toFixed(1)}%</MDBProgress>}
                </>
              </div>
              <div className='flex-col user-profile-mini-container'><Link to={`/team/${teamPk}`}> Member of {team.name}</Link>
                <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                  {team.members.map(member => (
                    <div key={member.username}>
                      <div>
                        <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div style={{ width: '40px', height: '40px', margin: '5px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: `url(${member.avatar})`, borderRadius: '100px' }} />{member.username}</Link></div>
                        <MDBProgress style={{ backgroundColor: `${team.dashboard_style}`, marginTop: '30px' }} marginTop='30px' height='30px' value={75}>{75}%</MDBProgress>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className=' member-dashboard-container'>

            {(!isUpdating)
              ? <div style={{ minWidth: '100%' }}>
                <div className='flex-col'>
                  <div style={{ }} className='flex-col'>
                    <div style={{ marginTop: '50px', marginLeft: '45px', fontSize: '25px', color: 'yellowgreen', marginBottom: '20px' }}>Drag Chores to Mark Them Complete</div>
                    <div style={{ maxWidth: '900px' }} className='flex-sa'>
                      <div
                        className='flex user-profile-mini-container' id={today}
                        onDrop={(event) => { handleDropInComplete(event, { today, userProfile }) }}
                        onDragOver={handleDragOver}
                      >
                        {userProfile.assignments.length > 0 && (
                          <div className='flex-sb'>
                            <div>Today's Chores
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes(today) && assignment.complete === false) && (
                                    <Card
                                      draggable
                                      onDragStart={(event) => { handleDragStart(event, { assignment, today, userProfile }) }}
                                    >
                                      <Card.Body style={{ border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>
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
                        Completed Chores {today} <span> {points.chore__points__sum ? <span>{points.chore__points__sum}</span> : 0} of {myPossiblePoints}</span>
                        {userProfile.assignments.length > 0 && (
                          <div>
                            {userProfile.assignments.map((assignment, idx) => (
                              <div
                                key={idx}
                              >
                                {((assignment.assignment_type.includes(today)) && assignment.complete === true) && (
                                  <Card
                                    draggable
                                    onDragStart={(event) => { handleDragStart(event, { assignment, today, userProfile }) }}
                                  >

                                    <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                  </Card>)}
                              </div>))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {showSummary && userProfile.assignments.length > 0
                    ? <div className='media-hide'><ChoreSummary token={token} today={today} todayIndex={todayIndex} teamPk={team.pk} teamView={false} username={username} /></div>
                    : <div onClick={() => toggleSummary()} className='flex-col-center' style={{ fontSize: '25px', color: 'yellowgreen', marginBottom: '20px', marginTop: '50px' }}>Show Summary</div>}

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
