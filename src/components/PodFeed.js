import { useState, useEffect } from 'react'
import { postMessage, getFeed } from '../api'

function PodFeed ({ token, profileUsername, today, myPod, myFeedPk }) {
  const [message, setMessage] = useState()
  const [feed, setFeed] = useState()

  function handleSubmit (event) {
    event.preventDefault()
    postMessage(token, myFeedPk, profileUsername, message, today)
      .then((response) => {
        updateFeed()
        setMessage('')
      })
  }

  useEffect(updateFeed, [token])
  function updateFeed () {
    getFeed(token, myFeedPk).then(feed => setFeed(feed))
  }

  return (
    <div>
      {feed && (
        <div>
          <div className='flex'>
            <div>
              {feed.notifications.map(notification => (
                <div key={notification.message + notification.target + today}>
                  <p>notification or message: "{notification.message}"</p>
                  <p>message sent to {notification.target} from {notification.sender}.</p>

                </div>
              ))}
            </div>

          </div>
          <div>
            <form className='add-message' onSubmit={handleSubmit}>
              <input type='text' placeholder='Write a comment' value={message} onChange={event => setMessage(event.target.value)} />
              <button type='submit'>Post</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default PodFeed
