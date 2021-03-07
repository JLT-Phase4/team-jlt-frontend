import { useState, useEffect } from 'react'
import { postMessage, getFeed } from '../api'

function Feed ({ token, profileUsername, today, feedPk }) {
  const [message, setMessage] = useState()
  const [feed, setFeed] = useState()
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

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
    <div>
      {feed && (
        <div className='flex-col' style={{ justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div>
              {feed.notifications.map(notification => (
                <div className='message-container' key={notification.message + notification.target + today}>
                  {/* <p className='message-username'> {notification.sender.username}</p> */}
                  <div className='avatar-holder message-avatar' style={(notification.sender.avatar === undefined || notification.sender.avatar === '' || notification.sender.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${notification.sender.avatar})` }} />
                  <p className='message-username'> {notification.sender.username}</p>
                  <p>{notification.message}</p>
                </div>
              ))}
            </div>

          </div>
          <div>
            <form className='comment-box' onSubmit={handleSubmit}>
              <input className='comment-input' type='text' placeholder='Write a comment...' value={message} onChange={event => setMessage(event.target.value)} />
              <button className='comment-submit-button' type='submit'>Send</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default Feed

{ /* {feed.notifications.map(notification => ( */ }
