import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getChore } from './../api'

const ChoreDetail = ({ token }) => {
  const { chorePk } = useParams()
  const [chore, setChore] = useState()

  useEffect(updateChores, [token, chorePk])

  function updateChores () {
    getChore(token, chorePk).then(chore => setChore(chore))
  }

  return (
    <>
      {chore && (
        <div className='member-dashboard-container'>
          <div className='team-title'> {chore.name}</div>
          <div className='flex' style={{ fontSize: '25px', fontWeight: '300' }}>
            <div style={{ color: 'yellowgreen', marginRight: '10px', fontWeight: '600' }}>
              {chore.detail}
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
          <Link style={{ marginTop: '30px', fontSize: '25px' }} to={`/member/${chore.user}/chores`}><span className='material-icons'>arrow_back</span>All {chore.user}'s chores</Link>

        </div>
      )}
    </>
  )
}

export default ChoreDetail
