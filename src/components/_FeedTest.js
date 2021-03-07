import { useState, useEffect } from 'react'
import { postMessage, getFeed } from '../api'
import fakeNotifications from '../fakeNotifications'
import fakeStatusNotifications from '../fakeStatusNotifications'

function Feed ({ token, profileUsername, today, feedPk }) {
  const [message, setMessage] = useState()
  const [feed, setFeed] = useState()
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  const myNotifications = fakeNotifications.notifications
  const myStatusNotifications = fakeStatusNotifications.notifications
  const allNotifications = myNotifications.concat(myStatusNotifications)
  console.log(allNotifications)
  console.log(myNotifications, 'my initial notifications')

  function compare (a, b) {
    const timeA = a.time
    const timeB = b.time

    let comparison = 0
    if (timeA > timeB) {
      comparison = 1
    } else if (timeA < timeB) {
      comparison = -1
    }
    return comparison
  }

  const mySortedNotifications = myNotifications.sort(compare)

  const allSortedNotifications = allNotifications.sort(compare)

  // function handleSubmit (event) {
  //   event.preventDefault()
  //   postMessage(token, feedPk, profileUsername, message, today)
  //     .then((response) => {
  //       updateFeed()
  //       setMessage('')
  //     })
  // }

  // useEffect(updateFeed, [token])
  // function updateFeed () {
  //   getFeed(token, feedPk).then(feed => setFeed(feed))
  // }

  return (
    <div>
      {allSortedNotifications && (
        <div className='flex-col' style={{ justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div>
              {allSortedNotifications.map(notification => (
                <div className='message-container' key={notification.time}>
                  {/* <p className='message-username'> {notification.sender.username}</p> */}
                  <p>{notification.message}</p><span>Notification time {notification.time}</span>
                </div>
              ))}
            </div>

          </div>
          {/* <div>
            <form className='comment-box' onSubmit={handleSubmit}>
              <input className='comment-input' type='text' placeholder='Write a comment...' value={message} onChange={event => setMessage(event.target.value)} />
              <button className='comment-submit-button' type='submit'>Send</button>
            </form>
          </div> */}
        </div>
      )}

    </div>
  )
}
export default Feed

// {/* {feed.notifications.map(notification => ( */}
