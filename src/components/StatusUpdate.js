import { useState, useEffect } from 'react'
import { getStatusUpdate } from '../api'

function StatusUpdate ({ token, profileUsername, today, feedPk }) {
  const [feed, setFeed] = useState()

  useEffect(updateFeed, [token])
  function updateFeed () {
    getStatusUpdate(token).then(feed => setFeed(feed))
  }

  return (
    <div>
      {feed && (
        <div className='flex-col' style={{ justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div>
              {feed.items.map(notification => (
                <div className='message-container' key={notification.published}>
                  <p>{notification.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default StatusUpdate
