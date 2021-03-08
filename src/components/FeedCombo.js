import { useState, useEffect } from 'react'
import { postMessage, getFeed, getStatusUpdate } from '../api'

function FeedCombo ({ token, profileUsername, today, feedPk, teams }) {
  const [statusUpdates, setStatusUpdates] = useState()
  const [message, setMessage] = useState()
  const [feed, setFeed] = useState()
  const [allNotifications, setAllNotifications] = useState()
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  const [podMemberUsers, setPodMemberUsers] = useState([])
  const [podMembers, setPodMembers] = useState([])

  useEffect(updateStatus, [token])
  function updateStatus () {
    getStatusUpdate(token).then(feed => {
      const myUpdates = feed.items
      for (const item of myUpdates) {
        const title = item.title.split(' ?? ')
        item.username = title[0]
        item.message_update = title[1]
        item.message_day = title[2].slice(0, 3)
        const action = title[4].split(' ')[1]
        item.message_change = action
        item.points = parseInt(title[3])
      }
      setStatusUpdates(myUpdates)
    }
    )
  }

  useEffect(identifyPodMembers, [token])
  function identifyPodMembers () {
    const myPodMembersUsernames = []
    const myPodMembers = []
    for (const team of teams) {
      for (const member of team.members) {
        myPodMembersUsernames.push(member.username)
        myPodMembers.push(member)
      }
      myPodMembersUsernames.push(team.captain)
    }

    setPodMemberUsers(myPodMembersUsernames)
    setPodMembers(myPodMembers)
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
      {allNotifications && podMemberUsers && (
        // <div className='flex-col' style={{ justifyContent: 'space-between', height: '90vh' }}>
        <div>
          {allNotifications.map(notification => (
            <div className='message-container' key={notification.published}>
              {notification.message &&
                <div>
                  <div className='avatar-holder message-avatar' style={(notification.sender.avatar === undefined || notification.sender.avatar === '' || notification.sender.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${notification.sender.avatar})` }} />
                  <p className='message-username'> {notification.sender.username}</p>

                  <p>{notification.message}</p>
                </div>}
              {notification.title && podMemberUsers.includes(notification.username) &&
                <div>
                  {podMembers.map((member, idx) => (
                    <div key={idx}>
                      {member.username === notification.username &&
                        <div style={(member.username === profileUsername) ? { backgroundColor: '#a5ff008c', borderRadius: '10px' } : { backgroundColor: '#BDBDD6', borderRadius: '10px' }}>
                          <div className='avatar-holder message-avatar' style={(member.avatar === undefined || member.avatar === '' || member.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${member.avatar})` }} />
                          <p className='message-username'>{notification.username}</p>
                          <p>
                            <span style={{ color: 'dodgerblue' }} className='material-icons'>{notification.message_change === 'completed' ? 'verified' : 'add_task'}</span>
                            <span>{notification.message_change}</span>
                            <span style={{ textAlign: 'right' }}>({notification.message_day})</span> {notification.message_update}
                            {(notification.message_change === 'completed') && <span> for {notification.points} points</span>}
                          </p>

                        </div>}
                    </div>
                  ))}

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
