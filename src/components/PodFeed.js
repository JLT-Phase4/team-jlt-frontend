import { useState, useEffect } from 'react'
import { postMessage, getFeeds, getFeed } from '../api'

function PodFeed ({ token, profileUsername, today, myPod }) {
  const [message, setMessage] = useState('')
  const [feeds, setFeeds] = useState()

  // const feedPk =

  useEffect(renderFeeds, [token])
  function renderFeeds () {
    getFeeds(token)
      .then(feeds => setFeeds(feeds))
  }

  // function handleSubmit (event) {
  //   event.preventDefault()
  //   postMessage(token, feedPk, profileUsername, message, today)
  //     .then(data => updateFeed(data.message))
  // }

  // function updateFeed () {

  // }

  return (
    <div>
      {feeds && (
        <div className='flex'>
          {feeds.map(feed => (
            <div key={feed.pk}>
              {feed.pod === myPod && (
                <div>
                  {feed.notifications.map(notification => (
                    <div key={notification.message}>
                      {notification.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div>
        <form className='add-message'>
          <input type='text' placeholder='Write a comment' value={message} onChange={event => setMessage(event.target.value)} />
          <button type='submit'>Post</button>
        </form>
      </div>
    </div>
  )
}
export default PodFeed
