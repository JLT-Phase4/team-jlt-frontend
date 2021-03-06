import { useState, useEffect } from 'react'
import { postMessage, getFeed, getStatusUpdate } from '../api'

function FeedCombo ({ token, profileUsername, today, feedPk }) {
  const [statusUpdates, setStatusUpdates] = useState()
  const [message, setMessage] = useState()
  const [feed, setFeed] = useState()
  const [allNotifications, setAllNotifications] = useState()
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  useEffect(updateStatus, [token])
  function updateStatus () {
    getStatusUpdate(token).then(feed => {
      const myUpdates = feed.items
      setStatusUpdates(myUpdates)
    }
    )
  }

  useEffect(updateFeed, [token])
  function updateFeed () {
    getFeed(token, feedPk).then(feed => {
      const myFeed = feed.notifications
      setFeed(myFeed)
    })
  }
  useEffect(updateAllNotifications, [token, feed, statusUpdates])
  function updateAllNotifications () {
    if (feed && statusUpdates) {
      const myNotifications = feed.concat(statusUpdates)
      const allSortedNotifications = myNotifications.sort(compare)

      setAllNotifications(allSortedNotifications)
      console.log(myNotifications, 'combined feeds')
    }
  }

  function handleSubmit (event) {
    event.preventDefault()
    console.log(feedPk)
    postMessage(token, feedPk, profileUsername, message, today)
      .then((response) => {
        updateFeed()
        setMessage('')
      })
  }
  function compare (a, b) {
    const publishedA = a.published
    const publishedB = b.published

    let comparison = 0
    if (publishedA > publishedB) {
      comparison = 1
    } else if (publishedA < publishedB) {
      comparison = -1
    }
    return comparison
  }

  return (
    <div>
      {/* {allNotifications && (
        <div className='flex-col' style={{ justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div>
              {statusUpdate.map(notification => (
                <div className='message-container' key={notification.published}>
                  <p>{notification.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
      {allNotifications && (
        <div>
          {allNotifications.map(notification => (
            <div className='message-container' key={notification.published}>
              {notification.message &&
                <div>
                  <div className='avatar-holder message-avatar' style={(notification.sender.avatar === undefined || notification.sender.avatar === '' || notification.sender.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${notification.sender.avatar})` }} />
                  <p className='message-username'> {notification.sender.username}</p>

                  <p>{notification.message}</p>
                </div>}
              {notification.title &&
                <div style={{ backgroundColor: '#ffd70069', borderRadius: '10px' }}>
                  {/* <div className='avatar-holder message-avatar' style={{ backgroundImage: `url(${AVATAR})` }} /> */}

                  <p style={{ padding: '5px' }}>{notification.title}</p>
                </div>}
            </div>
          ))}
        </div>
      )}
      <div>
        <form className='comment-box' onSubmit={handleSubmit}>
          <input className='comment-input' type='text' placeholder='Write a comment...' value={message} onChange={event => setMessage(event.target.value)} />
          <button className='comment-submit-button' type='submit'>Send</button>
        </form>
      </div>

    </div>
  )
}
export default FeedCombo
