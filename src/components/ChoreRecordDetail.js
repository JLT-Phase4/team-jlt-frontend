import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getChore, getRecords } from './../api'

const ChoreDetail = ({ token }) => {
  const { chorePk } = useParams()
  const [chore, setChore] = useState()
  const [records, setRecords] = useState([])
  const [choreRecords, setChoreRecords] = useState([])

  useEffect(updateChores, [token, chorePk])
  useEffect(updateRecords, [token])
  useEffect(updateChoreRecords, [chore, records])

  function updateChores () {
    getChore(token, chorePk).then(chore => setChore(chore))
  }

  function updateRecords () {
    getRecords(token).then(records => setRecords(records))
  }

  function updateChoreRecords () {
    let myRecords = []
    if (chore) {
      for (const record of records) {
        // console.log(typeof (record))
        // console.log(record.chore)
        console.log(chore.name)
        console.log(record)
        console.log(record.chore)
        const recordChoreName = record.chore
        const recordDate = record.date
        const choreName = chore.name
        if (recordChoreName === choreName) {
          myRecords = myRecords.concat(recordDate)
          console.log(chore.name)
        }
      }
      setChoreRecords(myRecords)
    }
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
              <div className='days-of-week' key={idx}>
                {(day && day === 'MD' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>M</Link></span>))}
                {(day && day === 'TUE' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>Tu</Link></span>))}
                {(day && day === 'WED' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>W</Link></span>))}
                {(day && day === 'THUR' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>Th</Link></span>))}
                {(day && day === 'FRI' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>F</Link></span>))}
                {(day && day === 'SAT' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>Sa</Link></span>))}
                {(day && day === 'SUN' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>Su</Link></span>))}
                {(day && day === 'ANY' && (<span><Link to={`/member/${chore.user}/${day}/chores`}>Any</Link></span>))}
              </div>
            ))}

          </div>
          <Link style={{ marginTop: '30px', fontSize: '25px' }} to={`/member/${chore.user}/chores`}><span className='material-icons'>arrow_back</span>All {chore.user}'s chores</Link>

        </div>

      )}
      {choreRecords && (
        <>
          {choreRecords.map((date, idx) => (
            <div key={idx}>{date}</div>
          )
          )}
        </>
      )}
    </>
  )
}

export default ChoreDetail
