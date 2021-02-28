import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { getTeam, getUserProfile, updateUserProfile, updateAssignment, getPoints } from '../api'
import AvatarImage from './AvatarImage'
import { Spring } from 'react-spring/renderprops'
import { MDBProgress } from 'mdbreact'

const UserProfile = ({ token, profileUsername, today, todayIndex }) => {
  const { username } = useParams()
  const [userProfile, setUserProfile] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [team, setTeam] = useState()
  const [teamPk, setTeamPk] = useState('')
  const [myAssignments, setMyAssignments] = useState()
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const [showSummary, setShowSummary] = useState(true)
  const [points, setPoints] = useState(0)
  const [myPossiblePoints, setMyPossiblePoints] = useState()

  useEffect(updateProfile, [token, username, isUpdating, points])

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

  // useEffect(updatePoints, [token, username])
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

  // useEffect(handleAssignmentUpdate)
  function handleAssignmentUpdate (assignPk, status, profileUsername, day) {
    if (assignPk) {
      updateAssignment(token, assignPk, status, profileUsername, day).then(updateProfile())
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {userProfile && team && myAssignments && points && (
        <>
          <div className='flex-col-center'>
            <div style={{ maxWidth: '1250px', marginTop: '100px' }} className='flex'>
              <div className='avatar-image' style={{ backgroundImage: `url(${avatar})` }} />
              <div style={{ marginTop: '30px' }} className='flex-col team-title'>{userProfile.username}'s page!
                {/* {(profileUsername === username) && */}
                <button onClick={() => setIsUpdating(true)} style={{ fontSize: '18px' }} className='log-reg-button'>Update Profile</button>
              </div>
              <div className='flex-col user-profile-mini-container'>Score Summary
                <>
                  {(points.chore_points_sum !== null) && points.chore_points_sum !== '' &&
                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}`, marginTop: '30px' }} marginTop='30px' height='30px' value={100 * parseInt(points.chore__points__sum) / myPossiblePoints}>{(100 * parseInt(points.chore__points__sum) / myPossiblePoints).toFixed(1)}%</MDBProgress>}
                  {/* <MDBProgress value={parseInt(myPossiblePoints)} className='my-2' /> */}
                </>
                {/* <div style={{ marginTop: '10px', marginBottom: '10px', backgroundColor: 'yellowgreen', width: `${10 * myPossiblePoints}px`, height: '20px', padding: '10px' }} />
                <div style={{ marginTop: '10px', marginBottom: '10px', backgroundColor: 'yellowgreen', width: `${10 * points.chore__points__sum}px`, height: '20px', padding: '10px' }} /> */}
              </div>
              <div className='flex-col user-profile-mini-container'>Member of {team.name}
                <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                  {team.members.map(member => (
                    <div key={member.username}> {member.username !== username && (
                      <ul className='flex'>
                        <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div style={{ width: '40px', height: '40px', margin: '5px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: `url(${member.avatar})`, borderRadius: '100px' }} />{member.username}</Link></div>
                        <div style={{ backgroundColor: '#0e0e0eba', width: '50px', height: '20px', padding: '10px' }}>
                          <Spring
                            reset
                            config={{ duration: 3000 }}
                            from={{ backgroundColor: '#00ff00', height: '20px', width: '0px', padding: '10px', marginTop: '10px' }}
                            to={{ backgroundColor: '#00ff00', height: '20px', width: '50px', padding: '10px', marginTop: '10px' }}
                          >
                            {props => (
                              <div style={props} />
                            )}
                          </Spring>
                        </div>
                      </ul>
                    )}
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
                  <div style={{ }} className='flex-col-center'>
                    <div style={{ marginTop: '50px', fontSize: '25px', color: 'yellowgreen', marginBottom: '20px' }}>Drag Chores to Mark Them Complete</div>
                    <div style={{ maxWidth: '900px' }} className='flex-sa'>
                      <div className='flex-sb user-profile-mini-container'>
                        {userProfile.assignments.length > 0 && (
                          <div className='flex-sb'>
                            <div>Today's Chores
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes(today) && assignment.complete === false) && (
                                    <Card onClick={() => handleAssignmentUpdate(assignment.pk, true, username, today)}>
                                      <Card.Body style={{ border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>
                                    </Card>)}
                                </div>))}
                            </div>
                            {/* <div>Weekly Chores
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes('ANY') && assignment.complete === false) && (
                                    <Card onClick={() => handleAssignmentUpdate(assignment.pk, true)}>
                                      <Card.Body style={{ border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>
                                    </Card>
                                  )}
                                </div>))}
                            </div> */}
                          </div>
                        )}
                      </div>
                      <div className='flex user-profile-mini-container'>Completed Chores {today} <span> {points.chore__points__sum ? <span>{points.chore__points__sum}</span> : 0} of {myPossiblePoints}</span>
                        {userProfile.assignments.length > 0 && (
                          <>
                            {userProfile.assignments.map((assignment, idx) => (
                              <div key={idx}>
                                {((assignment.assignment_type.includes(today)) && assignment.complete === true) && (
                                  <Card onClick={() => handleAssignmentUpdate(assignment.pk, false, username, today)}>
                                    <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                  </Card>)}
                              </div>))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {showSummary && userProfile.assignments.length > 0
                    ? <div onClick={() => toggleSummary()} className='flex-col-center' style={{ marginTop: '50px' }}>
                      <div style={{ fontSize: '25px', color: 'yellowgreen', marginBottom: '20px' }}>Chore Summary</div>
                      <div className='flex user-profile-sum-container'>
                        <div className='flex'>
                          {days.map((day, index) => (
                            <div key={index}>
                              <Card style={{ width: '100%' }}>
                                <Card.Body style={{ fontWeight: '300', backgroundColor: 'black', border: '2px solid' }}>
                                  {day}
                                </Card.Body>
                              </Card>
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes(day)) && (
                                    <Card>
                                      {(assignment.complete === true)
                                        ? <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                        : <Card.Body style={(index < todayIndex) ? { border: `2px solid ${team.dashboard_style}`, backgroundColor: '#e4e4e882', width: '100%' } : { border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>}
                                    </Card>
                                  )}
                                </div>))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
