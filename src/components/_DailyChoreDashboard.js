import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMemberChores } from '../api'
import image from './../images/days-of-week.png'

const DailyChoreDashboard = ({ token, today }) => {
  const { username } = useParams()
  const { day } = useParams()

  const [memberChores, setMemberChores] = useState([])
  const [dailyChores, setDailyChores] = useState([])

  useEffect(updateChores, [token, username])
  useEffect(updateDailyChores, [memberChores, day])

  function updateChores () {
    getMemberChores(token, username).then(chores => setMemberChores(chores))
  }

  function updateDailyChores () {
    let chores = []
    for (const chore of memberChores) {
      if (chore.chore_type.includes(day)) {
        chores = chores.concat(chore)
      }
    }
    setDailyChores(chores)
  }
  return (
    <div className='flex-col-center'>
      {(dailyChores) && (
        <div className='member-dashboard-container'>
          <div />
          <img width='150px' src={image} />
          {/* Above div is a holder for avatar */}
          <div className='team-title'>
            {username}'s {day} chores!
            {(today === day) && <span>  It's Today!</span>}
          </div>
          <div className='flex-sa'>
            <div className='team-scoreblock'>
              {dailyChores.map((chore, idx) => (
                <div key={idx}>
                  <div className='chore-detail'>{chore.name}
                    <span className='material-icons'>check_box_outline_blank</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link style={{ marginTop: '30px', fontSize: '25px' }} to={`/member/${username}/chores`}><span className='material-icons'>arrow_back</span>All {username}'s chores</Link>

        </div>
      )}
      <div className='daily-comment-feed'>Comments on chores for {username} on {day}
        <div>Don't forget to....</div>
        <div>Great job on ....</div>
      </div>

    </div>
  )
}

export default DailyChoreDashboard
