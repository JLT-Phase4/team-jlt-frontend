import { useState, useEffect } from 'react'
import { getStatusUpdate } from '../api'

function StatusUpdate ({ token, profileUsername, today, feedPk }) {
  const [feed, setFeed] = useState()

  useEffect(updateFeed, [token])
  function updateFeed () {
    getStatusUpdate(token).then(feed => {
      const myUpdates = feed.items
      const mySortedUpdates = myUpdates.sort(compare)

      setFeed(mySortedUpdates)
    }
    )
  }

  function compare (a, b) {
    // Use toUpperCase() to ignore character casing
    const titleA = a.title
    const titleB = b.title

    let comparison = 0
    if (titleA > titleB) {
      comparison = 1
    } else if (titleA < titleB) {
      comparison = -1
    }
    return comparison
  }

  return (
    <div>
      {feed && (
        <div className='flex-col' style={{ justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div>
              {feed.map(notification => (
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
