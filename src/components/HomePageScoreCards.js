import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBProgress } from 'mdbreact'

const HomePageScoreCards = ({ token, today, myTeam, teams, isCaptain, profileUsername }) => {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  const [newTeams, setNewTeams] = useState([])

  useEffect(getNewTeams, [token, teams])
  function getNewTeams () {
    if (teams) {
      console.log(teams)
      findLeader(teams)
    }
  }
  function findLeader (whoTeams) {
    const sortedTeams = whoTeams.sort(compare)
    if (sortedTeams.length > 0) {
      sortedTeams[0].isLeader = true
    }
    setNewTeams(sortedTeams)
  }
  function titleCase (string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
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
    <div>
      <div style={{ height: '38vh' }} className='home-header flex-col'>
        <div className=' flex'>
          {newTeams.map((team, idx) => (
            <div key={idx}>
              {(team) && (
                <div>
                  <div style={{ height: '35vh', paddingTop: '20px' }} className='team-scoreboard-container-home'>
                    <Link to={`/team/${team.pk}`} style={{ marginBottom: '30px', fontSize: '25px', fontWeight: '600' }}>
                      {(team.pk === myTeam) ? <span>{team.name}<span className='material-icons'>home</span></span> : <span>{team.name}</span>}
                      <span style={{ marginLeft: '10px' }}>{(100 * team.teamPercentage).toFixed(0)}%</span>
                    </Link>
                    {team.members.map(member => (
                      <div key={member.username}>
                        <div style={{ fontSize: '21px', padding: '5px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div className='avatar-holder' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />{member.username}</Link></div>
                        {member.possible_chore_points.chore__points__sum >= 0 && member.earned_chore_points.chore__points__sum >= 0
                          ? <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='2vh' value={100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum}>{(100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum).toFixed(1)}%</MDBProgress>
                          : <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='2vh' value={0} />}
                      </div>
                    ))}
                  </div>
                  {/* <div style={{ alignItems: 'center' }} className='team-score-indicator'> */}
                  {/* <div style={{ padding: '3px', fontSize: '28px' }}>{(100 * team.teamPercentage).toFixed(0)}% */}
                  {/* {team.isLeader && <span style={{ color: `${team.dashboard_style}`, fontSize: '40px' }} className='material-icons'>emoji_events</span>} */}
                  {/* </div> */}
                  {/* </div> */}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
      {newTeams.map((team, idx) => (
        <div key={idx}>
          {team.isLeader &&
            <div className='scroll-effect' style={{ paddingTop: '10px', fontSize: '32px' }}><span>"{team.name}" are in the lead as of {titleCase(today)}</span></div>}
        </div>
      ))}

    </div>

  )
}

export default HomePageScoreCards
