import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getChore, getRecords } from './../api'

const ChoreDetail = ({ token }) => {
  const { chorePk } = useParams()
  const [chore, setChore] = useState()
  const [records, setRecords] = useState([])
  const [choreRecords, setChoreRecords] = useState([])
  const DAYS = ['MD', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']

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
        const recordChoreName = record.chore
        const recordDate = record.date
        const convertDate = new Date(recordDate)
        const dayOfWeek = convertDate.getDay()
        let dayInText = ''
        if (dayOfWeek === 0) {
          dayInText = 'SUN'
        } else if (dayOfWeek === 1) {
          dayInText = 'MD'
        } else if (dayOfWeek === 2) {
          dayInText = 'TUE'
        } else if (dayOfWeek === 3) {
          dayInText = 'WED'
        } else if (dayOfWeek === 4) {
          dayInText = 'THUR'
        } else if (dayOfWeek === 5) {
          dayInText = 'FRI'
        } else if (dayOfWeek === 6) {
          dayInText = 'SAT'
        }
        const choreName = chore.name
        if (recordChoreName === choreName) {
          myRecords = myRecords.concat(dayInText)
        }
      }
      setChoreRecords(myRecords)
    }
  }

  return (
    <div className='flex-col-center'>
      {chore && (
        <div className='member-dashboard-container'>
          <div style={{ width: '150px', height: '150px', borderRadius: '150px', backgroundSize: 'cover', backgroundImage: 'url("https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDQxMTN8MHwxfHNlYXJjaHw2fHxkb2d8ZW58MHx8fA&ixlib=rb-1.2.1&q=80&w=1080")' }} />

          <div className='team-title'> {chore.name}</div>
          <div className='flex' style={{ fontSize: '25px', fontWeight: '300' }}>
            <div className='chore-detail'>
              {chore.detail}
            </div>
            {chore.chore_type.map((day, idx) => (
              <div className='days-of-week' key={idx}>
                {DAYS.map((DAY, idxDAY) => (
                  <div key={idxDAY}>
                    {(day && day === DAY) &&
                      <span>
                        <Link to={`/member/${chore.user}/${day}/chores`}>{DAY}
                          <span className='material-icons'>
                            {(choreRecords.includes(day)) ? 'check_box' : 'check_box_outline_blank'}
                          </span>
                        </Link>
                      </span>}
                  </div>
                ))}
                {(day && day === 'ANY') &&
                  <span>
                    <Link to={`/member/${chore.user}/${day}/chores`}>Any
                      <span className='material-icons'>
                        {(choreRecords.length > 0) ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </Link>
                  </span>}
              </div>
            ))}

          </div>
          <Link style={{ marginTop: '30px', fontSize: '25px' }} to={`/member/${chore.user}/chores`}><span className='material-icons'>arrow_back</span>All {chore.user}'s chores</Link>
        </div>
      )}
      {(choreRecords && records && chore) && (
        <div className='daily-comment-feed'>
          {choreRecords.map((date, idx) => (
            <div key={idx}>{date}</div>
          )
          )}
          <div>{records.map((record, idx) => (
            <div key={idx}>
              {(record.chore === chore.name) && (
                <div><span>{record.comment}</span><span>{record.date}</span></div>
              )}
            </div>
          )
          )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChoreDetail
