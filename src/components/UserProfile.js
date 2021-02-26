import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getTeam, getUserProfile, updateUserProfile, updateAssignment, getPoints } from '../api'
import AvatarImage from './AvatarImage'

const UserProfile = ({ token, profileUsername, today, todayIndex }) => {
  const { username } = useParams()
  const [userProfile, setUserProfile] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [team, setTeam] = useState()
  const [teamPk, setTeamPk] = useState('')
  const [myChores, setMyChores] = useState()
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'ANY']
  const [showSummary, setShowSummary] = useState(true)
  const [points, setPoints] = useState(0)

  useEffect(updateProfile, [token, username, isUpdating])

  function updateProfile () {
    getUserProfile(token, username).then(profile => {
      setUserProfile(profile)
      setTeamPk(profile.teams[0])
      const userChores = []
      if (profile) {
        for (const chore of profile.assignments) {
          if (!userChores.includes(chore)) {
            userChores.push(chore)
          }
        }
        setMyChores(userChores)
      }
    })
  }

  useEffect(updatePoints, [token, username, handleAssignmentUpdate])
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

  function handleAssignmentUpdate (assignPk, status) {
    if (assignPk) {
      updateAssignment(token, assignPk, status).then(updateProfile())
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {userProfile && team && myChores && points && (
        <>
          <div style={{ marginLeft: '20px', marginTop: '100px' }} className='flex'>
            <div className='avatar-image' style={{ backgroundImage: `url(${avatar})` }} />
            <div style={{ marginTop: '30px' }} className='flex-col team-title'>{userProfile.username}'s page!
              {/* {(profileUsername === username) && */}
              <button onClick={() => setIsUpdating(true)} style={{ fontSize: '18px' }} className='log-reg-button'>Update Profile</button>
            </div>
          </div>
          <div style={{ minWidth: '90%' }} className=' member-dashboard-container'>

            {(!isUpdating)
              ? <div style={{ minWidth: '95%' }}>
                <div className='flex-col'>
                  <div style={{ }} className='flex-col'>
                    <div style={{ fontSize: '25px', color: 'yellowgreen', marginBottom: '20px' }}>Drag Chores to Mark Them Complete</div>
                    <div className='flex-sa'>
                      <div className='flex-sb' style={{ minWidth: '35%', minHeight: '10vh', border: 'solid 2px', borderRadius: '10px', margin: '10px' }}>
                        {userProfile.assignments.length > 0 && (
                          <div className='flex-sb'>
                            <div>Today's Chores
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes(today) && assignment.complete === false) && (
                                    <Card onClick={() => handleAssignmentUpdate(assignment.pk, true)}>
                                      <Card.Body style={{ border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>
                                    </Card>)}
                                </div>))}
                            </div>
                            <div>Weekly Chores
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {(assignment.assignment_type.includes('ANY') && assignment.complete === false) && (
                                    <Card onClick={() => handleAssignmentUpdate(assignment.pk, true)}>
                                      <Card.Body style={{ border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>
                                    </Card>
                                  )}
                                </div>))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: '35%', minHeight: '10vh', border: 'solid 2px', borderRadius: '10px', margin: '10px' }}>Completed Chores {today}
                        <div className='flex'>{points.chore__points__sum}
                          {userProfile.assignments.length > 0 && (
                            <>
                              {userProfile.assignments.map((assignment, idx) => (
                                <div key={idx}>
                                  {((assignment.assignment_type.includes(today)) && assignment.complete === true) && (
                                    <Card onClick={() => handleAssignmentUpdate(assignment.pk, false)}>
                                      <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                    </Card>)}
                                </div>))}
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                  <div onClick={() => toggleSummary()} className='flex-col' style={{ marginTop: '50px' }}><div style={{ fontSize: '25px', color: 'yellowgreen', marginBottom: '20px' }}>Chore Summary</div>
                    {showSummary
                      ? <div style={{ minWidth: '50%', border: 'solid 2px', borderRadius: '10px', margin: '10px' }}>
                        <div className='flex'>
                          {userProfile.assignments.length > 0 && (
                            <>
                              {days.map((day, index) => (
                                <div key={index}>
                                  <Card style={{ width: '100%' }}>
                                    <Card.Body style={{ fontWeight: '300', backgroundColor: 'black', border: '2px solid' }}>
                                      {day}
                                    </Card.Body>
                                  </Card>
                                  {userProfile.assignments.map((assignment, idx) => (
                                    <div key={idx}>
                                      <>
                                        {(assignment.assignment_type.includes(day)) && (
                                          <Card>
                                            {(assignment.complete === true)
                                              ? <Card.Body style={{ width: '100%', border: `2px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }}>{assignment.chore.name}<span className='material-icons'>check_box</span></Card.Body>
                                              : <Card.Body style={(index < todayIndex) ? { border: `2px solid ${team.dashboard_style}`, backgroundColor: '#e4e4e882', width: '100%' } : { border: `2px solid ${team.dashboard_style}`, width: '100%' }}>{assignment.chore.name}</Card.Body>}
                                          </Card>
                                        )}
                                      </>
                                    </div>))}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                      : null}
                  </div>
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
