import { useState, useEffect } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import { getTeam, postNotification, getFeed } from './../api'
import FeedComboTeamLevel from './FeedComboTeamLevel'
import ScoreBoard from './ScoreBoard'

const TeamDashboard = ({ token, profileUsername, today, myPod, feedPk, isCreatingTeam, setIsCreatingTeam, isCaptain }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [newTeam, setNewTeam] = useState()
  const [notPosted, setNotPosted] = useState(false)

  function updateTeamScore (team) {
    let teamTotalPoints = 0
    let teamPossiblePoints = 0

    for (const member of team.members) {
      teamTotalPoints += member.earned_chore_points.chore__points__sum
      teamPossiblePoints += member.possible_chore_points.chore__points__sum
      if ((member.earned_chore_points.chore__points__sum !== 0) && (member.earned_chore_points.chore__points__sum !== null)) {
        member.percentageScore = member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum
      } else {
        member.percentageScore = 0
      }
    }
    team.teamTotalPoints = teamTotalPoints
    team.teamPossiblePoints = teamPossiblePoints
    if (teamPossiblePoints > 0) {
      team.teamPercentage = teamTotalPoints / teamPossiblePoints
    } else {
      team.teamPercentage = 0
    }
  }

  useEffect(getNewTeam, [token, team])
  function getNewTeam () {
    if (team) {
      findLeader(team.members)
    }
  }

  function findLeader (whoLeads) {
    const sortedMember = whoLeads.sort(compare)
    if (sortedMember.length > 0) {
      sortedMember[0].isLeader = true
      // console.log(sortedMember[0])
    }
    setNewTeam(sortedMember)
  }

  function titleCase (string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
  }

  function compare (b, a) {
    const percentageScoreA = a.percentageScore
    const percentageScoreB = b.percentageScore
    let comparison = 0
    if (percentageScoreA > percentageScoreB) {
      comparison = 1
    } else if (percentageScoreA < percentageScoreB) {
      comparison = -1
    }
    return comparison
  }

  useEffect(updateTeam, [token, teamPk, today, profileUsername, notPosted])

  function updateTeam () {
    getTeam(token, teamPk).then(team => {
      updateTeamScore(team)
      setTeam(team)
    })
  }

  function handleCreate () {
    setIsCreatingTeam(true)
  }

  useEffect(updateNotifications, [token, today, notPosted])
  function updateNotifications () {
    if (team && notPosted && feedPk) {
      for (const member of team.members) {
        console.log(member.possible_chore_points.chore__points__sum, member.earned_chore_points.chore__points__sum)
        if (member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum > 0.5) {
          console.log(member.username + 'has more than than than 50%')
          createNotifications(feedPk, member.username, 'you are above 30%')
        }
      }
    }
  }

  function createNotifications (feedPk, target, message) {
    postNotification(token, feedPk, target, message).then((response) => {
      updateTeam()
      setNotPosted(false)
    }
    )
  }

  if (!token) {
    return <Redirect to='/login' />
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {team && newTeam &&
        (
          <div>
            <div className='flex-col-center'>
              <div className='flex-nowrap home-page-container'>
                <div className='flex-col' style={{ width: '1000px' }}>

                  <div className='carousel-team-dashboard-container' style={{ height: '38vh', backgroundImage: `url(${team.background_image}` }} />
                  <div style={{ minHeight: '38vh' }} className='flex-col home-header'>
                    {/* <div style={{ color: 'black', fontSize: '40px' }}>{team.name}!</div> */}

                    {team.members.length > 0
                      // ? <div style={{ minHeight: '38vh' }} className='flex-sa home-header'>
                      ? <div style={{ height: '100%' }} className='flex-sa'>
                        <div className='flex-col' style={{ width: '400px', marginTop: '30px', marginBottom: '30px', alignItems: 'center', justifyContent: 'space-around' }}>
                          <div style={{ color: 'black', fontSize: '40px' }}>{team.name}!
                            <span> {isCaptain === true && team.captain === profileUsername &&
                              <Link to={`/create-team-members/${team.pk}/${team.name}`}>
                                <span onClick={() => handleCreate()} style={{ marginTop: '0' }} className='material-icons'>add_circle</span>
                              </Link>}
                            </span>
                          </div>

                          <div style={{ color: 'rgb(227, 230, 236)', backgroundColor: `${team.dashboard_style}` }} className='team-slogan'>{team.slogan}!</div>
                          <audio className='audio-feature' controls src={team.theme_song} />
                          {/* <div style={{ marginTop: '20px', alignItems: 'center', opacity: '.8', backgroundColor: `${team.dashboard_style}`, color: 'white' }} className='team-score-indicator'>
                            <div style={{ padding: '3px', fontSize: '28px' }}>{(100 * team.teamPercentage).toFixed(0)}%
                            </div>
                          </div> */}
                        </div>
                        <div style={{ width: '400px', alignItems: 'center', justifyContent: 'space-around' }} className='flex-col'>
                          <div style={{ width: '380px', marginTop: '1px', marginBottom: '4px', paddingTop: '0', paddingBottom: '0', justifyContent: 'center' }} className='flex team-scoreboard-container-home'>
                            {team.members.map(member => (
                              <ScoreBoard team={team} member={member} key={member.username} />
                            ))}
                          </div>
                          <div style={{ width: '360px', marginTop: '20px', alignItems: 'center', backgroundColor: `${team.dashboard_style}`, color: 'white' }} className='team-score-indicator'>
                            <div style={{ padding: '3px', fontSize: '28px' }}>{(100 * team.teamPercentage).toFixed(0)}% as of {today}
                            </div>
                          </div>
                          {/* {isCaptain === true && team.captain === profileUsername &&
                            <Link to={`/create-team-members/${team.pk}/${team.name}`}><span onClick={() => handleCreate()} style={{ marginTop: '0' }} className='material-icons'>add_circle</span></Link>} */}
                        </div>
                        </div>
                      : <div style={{ height: '100%' }} className='flex'>
                        <div className='flex-col' style={{ width: '400px', marginTop: '30px', marginBottom: '30px', alignItems: 'center', justifyContent: 'space-around' }}>
                          {/* <div style={{ color: 'black', fontSize: '40px' }}>{team.name}!</div> */}
                          <div className='team-slogan' style={{ color: 'rgb(227, 230, 236)', backgroundColor: `${team.dashboard_style}`, opacity: '.8' }}>{team.slogan}!</div>
                          <audio controls src={team.theme_song} />
                        </div>
                        <div style={{ width: '400px' }} className='flex team-scoreboard-container-home'>
                          <Link to={`/create-team-members/${team.pk}/${team.name}`}><button onClick={() => handleCreate()} className='log-reg-button'>Add Team Members</button></Link>
                        </div>

                      </div>}

                  </div>
                </div>
                {/* <div className='flex-col' style={{ alignItems: 'center' }}> */}
                {feedPk &&
                  <div className='team-feed-container'>
                    <FeedComboTeamLevel token={token} profileUsername={profileUsername} feedPk={feedPk} today={today} team={team} />
                  </div>}
                {/* </div> */}

              </div>
            </div>
            {newTeam.map((member, idx) => (
              <div key={idx}>
                {member.isLeader &&
                  <div className='scroll-effect' style={{ paddingTop: '10px', fontSize: '32px' }}><span>{member.username} is in the lead as of {titleCase(today)}</span></div>}
              </div>
            ))}
          </div>

        )}
    </div>
  )
}

export default TeamDashboard
