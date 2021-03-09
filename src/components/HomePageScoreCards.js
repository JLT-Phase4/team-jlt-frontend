import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScoreBoard from './ScoreBoard'
import { MDBProgress } from 'mdbreact'

const HomePageScoreCards = ({ token, myTeam, teams, isCaptain, profileUsername }) => {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  const [newTeams, setNewTeams] = useState([])
  // function calculateLeader () {
  //   let leader = 0
  //   for (const team of teams) {
  //     if (team.teamTotalPoints / team.teamPossiblePoints > leader) {
  //       leader = team.teamTotalPoints / team.teamPossiblePoints
  //       setIsLeader(true)
  //     }
  //   }
  //   teams.is_leader =
  // }

  useEffect(getNewTeams, [token, teams])
  function getNewTeams () {
    if (teams) {
      console.log(teams)
      findLeader(teams)
    }
  }
  // useEffect(findLeader, [token, teams])
  function findLeader (whoTeams) {
    // if (teams) {
    console.log(whoTeams)
    const sortedTeams = whoTeams.sort(compare)
    if (sortedTeams.length > 0) {
      sortedTeams[0].isLeader = true
    }
    console.log(sortedTeams, 'this is the leader')
    setNewTeams(sortedTeams)
    // // }
  }

  function compare (b, a) {
    const teamPercentageA = a.teamPercentage
    const teamPercentageB = b.teamPercentage

    let comparison = 0
    if (teamPercentageA > teamPercentageB) {
      comparison = 1
    } else if (teamPercentageA < teamPercentageB) {
      comparison = -1
    }
    return comparison
  }

  return (
    <div style={{ minHeight: '40vh', overflow: 'scroll' }} className='home-header flex-nowrap'>
      {newTeams.map((team, idx) => (
        <div key={idx}>
          {(team) && (

            <div>
              <div style={(team.pk === myTeam) ? { backgroundColor: '#fff9c4', height: '30vh' } : { backgroundColor: '#dde4dd17', height: '30vh' }} className='team-scoreboard-container-home'>
                <Link to={`/team/${team.pk}`} style={{ fontSize: '25px', fontWeight: '600' }}>
                  {team.isLeader ? <span style={{ color: 'fuchsia' }}>{team.name}</span> : <span>{team.name}</span>}
                </Link>
                {team.members.map(member => (
                  <div key={member.username}>
                    <div style={{ fontSize: '21px', padding: '5px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div className='avatar-holder' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />{member.username}</Link></div>
                    <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='25px' value={100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum}>{(100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum).toFixed(1)}%</MDBProgress>
                  </div>
                  // <ScoreBoard team={team} member={member} key={member.username} />
                ))}
              </div>
              <div style={team.isLeader ? { backgroundColor: '#fff9c4', height: '10vh', alignItems: 'center' } : { backgroundColor: '#dde4dd17', height: '10vh', alignItems: 'center' }} className='team-scoreboard-container-home'>
                {/* <div>Total Points: {team.teamTotalPoints}</div>
                <div>Possible Points: {team.teamPossiblePoints}</div> */}
                {/* <div>Team Percentage: {(100 * team.teamTotalPoints / team.teamPossiblePoints).toFixed(1)}</div> */}
                <div style={{ fontSize: '40px' }}>{(100 * team.teamPercentage).toFixed(0)}%
                  {team.isLeader && <span style={{ fontSize: '40px' }} className='material-icons'>emoji_events</span>}
                </div>
              </div>
            </div>
          )}

        </div>
      ))}
      {/* {isCaptain
        ? <div>
          <button className='home-dash-button'><Link to='/create-team-dashboard'>Create a Team</Link></button>
          <button className='home-dash-button'><Link to='/create-team-dashboard'>Manage my Team</Link></button>
        </div>
        : <div>
          <button className='home-dash-button'><Link to={`/user-profile/${profileUsername}/`}>My Profile</Link></button>
          <button className='home-dash-button'><Link to='/create-team-dashboard'>Create a Team</Link></button>
        </div>} */}

    </div>
  )
}

export default HomePageScoreCards
