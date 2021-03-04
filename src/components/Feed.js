import { useState, useEffect } from 'react'
import { postMessage, getFeed } from '../api'

function Feed ({ token, profileUsername, today, feedPk }) {
  const [message, setMessage] = useState()
  const [feed, setFeed] = useState()

  function handleSubmit (event) {
    event.preventDefault()
    postMessage(token, feedPk, profileUsername, message, today)
      .then((response) => {
        updateFeed()
        setMessage('')
      })
  }

  useEffect(updateFeed, [token])
  function updateFeed () {
    getFeed(token, feedPk).then(feed => setFeed(feed))
  }

  return (
    <div className='messages'>
      {feed && (
        <div>
          <div>
            <div>
              {feed.notifications.map(notification => (

                <div className='message-content' key={notification.message + notification.target + today}>


                  <p> {notification.sender.username}</p>
                  <p>{notification.message}</p>
                </div>
              ))}
            </div>

          </div>
          <div>
            <form className='message-box' onSubmit={handleSubmit}>
              <input className='message-input' type='text' placeholder='Write a comment...' value={message} onChange={event => setMessage(event.target.value)} />
              <button className='message-submit' type='submit'>Send</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default Feed
