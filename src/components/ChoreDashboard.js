import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMemberChores } from './../api'

const ChoreDashboard = ({ token }) => {
  const { username } = useParams()
  const [memberChores, setMemberChores] = useState([])

  useEffect(updateChores, [token, username])

  function updateChores () {
    getMemberChores(token, username).then(chores => setMemberChores(chores))
  }

  return (
    <>
      {memberChores && (
        <div className='member-dashboard-container'>
          {/* <div style={{ width: '150px', height: '150px', borderRadius: '150px', backgroundSize: 'cover' }} /> */}
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
                      {(day && day === 'MD' && (<span><Link to={`/member/${username}/${day}/chores`}>M</Link></span>))}
                      {(day && day === 'TUE' && (<span><Link to={`/member/${username}/${day}/chores`}>Tu</Link></span>))}
                      {(day && day === 'WED' && (<span><Link to={`/member/${username}/${day}/chores`}>W</Link></span>))}
                      {(day && day === 'THUR' && (<span><Link to={`/member/${username}/${day}/chores`}>Th</Link></span>))}
                      {(day && day === 'FRI' && (<span><Link to={`/member/${username}/${day}/chores`}>F</Link></span>))}
                      {(day && day === 'SAT' && (<span><Link to={`/member/${username}/${day}/chores`}>Sa</Link></span>))}
                      {(day && day === 'SUN' && (<span><Link to={`/member/${username}/${day}/chores`}>Su</Link></span>))}
                      {(day && day === 'ANY' && (<span><Link to={`/member/${username}/${day}/chores`}>Any</Link></span>))}
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
