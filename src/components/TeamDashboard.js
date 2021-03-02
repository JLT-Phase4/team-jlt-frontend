import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeam, getUserProfile, getPoints } from './../api'
import { Spring } from 'react-spring/renderprops'
import { MDBProgress } from 'mdbreact'
// import TeamFeed from './components'

const TeamDashboard = ({ token, profileUsername, today }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [isMember, setIsMember] = useState(false)
  const [userProfiles, setUserProfiles] = useState([])
  const [pointsSummary, setPointsSummary] = useState()
  // const [teamPointTotals, setTeamPoints] = useState([])

  useEffect(checkMember, [profileUsername, team])

  function checkMember () {
    if (team) {
      if (team.members.includes(profileUsername)) {
        setIsMember(true)
      }
    }
  }

  useEffect(updateTeam, [token, teamPk, today, profileUsername])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  useEffect(updateProfiles, [token, team, today, teamPk])
  function updateProfiles () {
    console.log('update profiles use effect happening')
    if (team) {
      let allUserProfiles = []
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
            getPoints(token, member.username).then(points => {
              console.log(points.chore__points__sum)
              // const pointsSummary = points.chore__points__sum
              setPointsSummary(points.chore__points__sum)
            })
            if (pointsSummary) {
              profile.currentPoints = pointsSummary
            }

            // for (const user of teamPointTotals) {
            //   if (user.user === member.username) {
            //     console.log('setting current points to userprofile')
            //     profile.currentPoints = user.userPoints
            //   }
            // }
            console.log('I am updating profiles')
          }

          setUserProfiles(allUserProfiles)
        }
        )
      }
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {team && userProfiles &&
        (
          <>
            <div className='flex-center'>
              <div className='team-dashboard-container' style={{ backgroundImage: `url(${team.background_image}` }}>
                <div className='team-title'>{team.name}!</div>
                <div className='team-slogan'>{team.slogan}!
                  <audio controls style={{ width: '140px', height: '15px' }} src={team.theme_song} />
                </div>
              </div>
              <div style={{ width: '100%', margin: '20px', justifyContent: 'space-between' }} className='flex'>
                <div style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: `${team.dashboard_style}` }} className='team-feed-container'>
                  <h1>Feed will go here:</h1>
                  <ul>
                    <li>notifications</li>
                    <li>comments</li>
                    <li>emojis?</li>
                  </ul>
                  {/* <TeamFeed teamPk={teamPk} /> */}
                </div>
                <div className='team-dashboard-scoreboard-container' style={{ border: `3px solid ${team.dashboard_style}` }}>
                  <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                    {userProfiles.length > 0
                      ? (
                        <div>
                          {team.members.map(member => (
                          // {userProfiles.map(member => (
                            <div key={member.username}>
                              <div style={{ fontSize: '23px', padding: '10px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div style={{ width: '40px', height: '40px', margin: '5px', backgroundColor: 'crimson', backgroundSize: 'cover', backgroundImage: `url(${member.avatar})`, borderRadius: '100px' }} />{member.username}</Link></div>

                              {/* <div style={{ backgroundColor: '#0e0e0eba', width: '200px', height: '20px', padding: '10px' }} /> */}
                              <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='30px' value={100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum}>{(100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum).toFixed(1)}%</MDBProgress>

                              {/* <div>{member.earned_chore_points.chore__points__sum} of {member.possible_chore_points.chore__points__sum} </div> */}
                            </div>
                          ))}
                        </div>
                        )
                      : <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/create-team-members/${team.pk}/${team.name}`}>Add Team Members</Link></button>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default TeamDashboard
