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
          <div style={{ width: '150px', height: '150px', borderRadius: '150px', backgroundSize: 'cover' }} />
          <div className='team-title'>{username}'s page!</div>
          <div className='flex-sa'>
            <div className='team-scoreblock'>
              {memberChores.map((chore, idx) => (
                <div className='flex' style={{ fontSize: '25px', fontWeight: '300' }} key={idx}>
                  <div>
                    <Link style={{ color: 'yellowgreen', marginRight: '10px', fontWeight: '600' }} to={`/choredetail/${chore.pk}`}>{chore.name}</Link>
                  </div>
                  {chore.chore_type.map((day, idx) => (
                    <div key={idx}>
                      {(day && day === 'MD' && (<span style={{ marginLeft: '5px' }}>M</span>))}
                      {(day && day === 'TUE' && (<span style={{ marginLeft: '5px' }}>Tu</span>))}
                      {(day && day === 'WED' && (<span style={{ marginLeft: '5px' }}>W</span>))}
                      {(day && day === 'THUR' && (<span style={{ marginLeft: '5px' }}>Th</span>))}
                      {(day && day === 'FRI' && (<span style={{ marginLeft: '5px' }}>F</span>))}
                      {(day && day === 'SAT' && (<span style={{ marginLeft: '5px' }}>Sa</span>))}
                      {(day && day === 'SUN' && (<span style={{ marginLeft: '5px' }}>Su</span>))}
                      {(day && day === 'ANY' && (<span style={{ marginLeft: '5px' }}>Any</span>))}

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
