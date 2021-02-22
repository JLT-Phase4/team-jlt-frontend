import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMemberChores } from './../api'

const ChoreDashboard = ({ token }) => {
  const { username } = useParams()
  const [memberChores, setMemberChores] = useState([])
  const DAYS = ['MD', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']

  useEffect(updateChores, [token, username])

  function updateChores () {
    getMemberChores(token, username).then(chores => setMemberChores(chores))
  }

  return (
    <>
      {memberChores && (
        <div className='member-dashboard-container'>
          <div style={{ width: '150px', height: '150px', borderRadius: '150px', backgroundSize: 'cover', backgroundImage: 'url("https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDQxMTN8MHwxfHNlYXJjaHw2fHxkb2d8ZW58MHx8fA&ixlib=rb-1.2.1&q=80&w=1080")' }} />
          {/* above is placeholder for member avatar  */}
          <div className='team-title'>{username}'s page!</div>
          <div className='flex-sa'>
            <div className='team-scoreblock'>
              {memberChores.map((chore, idx) => (
                <div className='flex' style={{ fontSize: '25px', fontWeight: '300' }} key={idx}>
                  <div>
                    <Link className='chore-detail' to={`/choredetail/${chore.pk}`}>{chore.name}</Link>
                  </div>
                  {chore.chore_type.map((day, idx) => (
                    <div className='days-of-week' key={idx}>
                      {DAYS.map((DAY, idxDAY) => (
                        <div key={idxDAY}>
                          {(day && day === DAY) &&
                            <span>
                              <Link to={`/member/${chore.user}/${day}/chores`}>{DAY}
                                <span className='material-icons'>
                                  check_box_outline_blank
                                </span>
                              </Link>
                            </span>}
                        </div>
                      ))}
                      {(day && day === 'ANY') &&
                        <span>
                          <Link to={`/member/${chore.user}/ANY/chores`}>ANY
                            <span className='material-icons'>
                              check_box_outline_blank
                            </span>
                          </Link>
                        </span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChoreDashboard
