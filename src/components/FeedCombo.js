import { useState, useEffect } from 'react'
import { postMessage, getFeed, getStatusUpdate } from '../api'

function FeedCombo ({ token, profileUsername, today, feedPk, teams }) {
  const [statusUpdates, setStatusUpdates] = useState()
  const [message, setMessage] = useState()
  const [feed, setFeed] = useState()
  const [allNotifications, setAllNotifications] = useState()
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  const [podMembers, setPodMembers] = useState([])
  useEffect(updateStatus, [token])
  function updateStatus () {
    getStatusUpdate(token).then(feed => {
      const myUpdates = feed.items
      for (const item of myUpdates) {
        const updateUser = item.title.split(' ,')[0]
        const updateMessage = item.title.split(' ,')[1].split('completed')[0]
        // const updateMessage = item.title.split('completed')[0]
        item.username = updateUser
        item.message_update = updateMessage
      }
      setStatusUpdates(myUpdates)
    }
    )
  }

  useEffect(identifyPodMembers, [token])
  function identifyPodMembers () {
    const myPodMembers = []
    for (const team of teams) {
      for (const member of team.members) {
        myPodMembers.push(member.username)
      }
    }
    setPodMembers(myPodMembers)
    console.log(myPodMembers, 'pod members')
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
      {allNotifications && podMembers && (
        // <div className='flex-col' style={{ justifyContent: 'space-between', height: '90vh' }}>
        <div style={{ height: '90vh' }}>
          {allNotifications.map(notification => (
            <div className='message-container' key={notification.published}>
              {notification.message &&
                <div>
                  <div className='avatar-holder message-avatar' style={(notification.sender.avatar === undefined || notification.sender.avatar === '' || notification.sender.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${notification.sender.avatar})` }} />
                  <p className='message-username'> {notification.sender.username}</p>

                  <p>{notification.message}</p>
                </div>}
              {notification.title && podMembers.includes(notification.username) &&
                <div style={{ backgroundColor: '#ffd70069', borderRadius: '10px', textAlign: 'right' }}>
                  <div className='avatar-holder message-avatar' style={{ backgroundImage: `url(${AVATAR})` }} />
                  {/* <p style={{ padding: '5px' }}>{notification.title}</p> */}
                  <p className='message-username'>{notification.username}</p>

                  <p>completed {notification.message_update}</p>

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
