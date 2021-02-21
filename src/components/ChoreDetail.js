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
            <div className='chore-detail'>
              {chore.detail}
            </div>
            {chore.chore_type.map((day, idx) => (
              <div key={idx}>
                {(day && day === 'MD' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>M</Link></span>))}
                {(day && day === 'TUE' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>Tu</Link></span>))}
                {(day && day === 'WED' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>W</Link></span>))}
                {(day && day === 'THUR' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>Th</Link></span>))}
                {(day && day === 'FRI' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>F</Link></span>))}
                {(day && day === 'SAT' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>Sa</Link></span>))}
                {(day && day === 'SUN' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>Su</Link></span>))}
                {(day && day === 'ANY' && (<span style={{ marginLeft: '5px' }}><Link to={`/member/${chore.user}/${day}/chores`}>Any</Link></span>))}

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
