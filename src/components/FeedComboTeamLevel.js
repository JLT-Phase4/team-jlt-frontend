
import { useState, useEffect } from 'react'
import { postMessage, getFeed, getStatusUpdate } from '../api'
import Picker from 'emoji-picker-react'
import EmojiPicker from 'emoji-picker-react'

function FeedComboTeamLevel ({ token, profileUsername, today, feedPk, team }) {
  const [statusUpdates, setStatusUpdates] = useState()
  const [message, setMessage] = useState([])
  const [feed, setFeed] = useState()
  const [allNotifications, setAllNotifications] = useState()
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  const [podMemberUsers, setPodMemberUsers] = useState([])
  const [podMembers, setPodMembers] = useState([])

  const [chosenEmoji, setChosenEmoji] = useState([])
  const [spaceEmoji, setSpaceEmoji] = useState([''])

  const onEmojiClick = (event, emojiObject, spaceEmoji) => {
    // console.log(message, 'this is our message')
    setMessage(message + emojiObject.emoji)
    setChosenEmoji(emojiObject.emoji)
    // console.log(emojiObject.emoji)
  }

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
        console.log(item.points)
      }
      setStatusUpdates(myUpdates)
    }
    )
  }

  useEffect(identifyPodMembers, [token])
  function identifyPodMembers () {
    const myPodMembersUsernames = []
    const myPodMembers = []
    for (const member of team.members) {
      myPodMembersUsernames.push(member.username)
      myPodMembers.push(member)
    }
    myPodMembersUsernames.push(team.captain)
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
  function handleClear () {
    setMessage('')
    setChosenEmoji('')
    setSpaceEmoji('')
  }

  function handleSubmit (event) {
    event.preventDefault()
    postMessage(token, feedPk, profileUsername, message, today)
      .then((response) => {
        updateFeed()
        setMessage('')
        setChosenEmoji('')
        setSpaceEmoji('')
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

  function showEmojis (event) {
    const x = document.getElementById('hide-emoji')

    if (x.style.display === 'none') {
      x.style.display = 'block'
    } else {
      x.style.display = 'none'
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {allNotifications && podMemberUsers && (
        // <div className='flex-col' style={{ justifyContent: 'space-between', height: '90vh' }}>
        <div>
          {allNotifications.map(notification => (
            <div className='message-container' key={notification.published}>
              {notification.message && podMemberUsers.includes(notification.sender.username) &&
                <div>
                  <div className='avatar-holder message-avatar' style={(notification.sender.avatar === undefined || notification.sender.avatar === '' || notification.sender.avatar === null) ? { backgroundImage: `url(${AVATAR})` } : { backgroundImage: `url(${notification.sender.avatar})` }} />
                  <p className='message-username'> {notification.sender.username}</p>

                  <p style={{ textAlign: 'left' }}>{notification.message}</p>
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
      {podMemberUsers.includes(profileUsername) &&

        <div>
          <form className='comment-box' onSubmit={handleSubmit}>
            <input className='comment-input' type='text' placeholder='Write a comment...' value={message} onChange={event => setMessage(event.target.value)} />
            <button className='comment-submit-button' type='submit'>Send</button>
            <button className='emoji-show-team' onClick={(event) => showEmojis(event)}>☺</button>
          </form>
          <div id='hide-emoji' style={{ display: 'none' }}>

            {chosenEmoji ? (
              <span> {chosenEmoji.emoji}</span>
            ) : (
              <span />
            )}
            <Picker onEmojiClick={onEmojiClick} />
          </div>

        </div>}

    </div>
  )
}
export default FeedComboTeamLevel
