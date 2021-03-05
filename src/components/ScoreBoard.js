
import { MDBProgress } from 'mdbreact'
import { Link } from 'react-router-dom'

const ScoreBoard = ({ member, team }) => {
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  return (
    <div key={member.username}>
      <div style={{ fontSize: '21px', padding: '5px' }}><Link className='flex-nowrap' to={`/user-profile/${member.username}/`}><div className='avatar-holder' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />{member.username}</Link></div>
      <MDBProgress style={{ backgroundColor: `${team.dashboard_style}` }} height='25px' value={100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum}>{(100 * member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum).toFixed(1)}%</MDBProgress>
    </div>
  )
}

export default ScoreBoard
