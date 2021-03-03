import { useState, useEffect } from 'react'
import { postMessage, getFeeds } from '../api'

function PodFeed ({ token, profileUsername, today, myPod, notPosted }) {
  const [message, setMessage] = useState('')
  const [feeds, setFeeds] = useState()

  // const feedPk =

  useEffect(renderFeeds, [token, notPosted])
  function renderFeeds () {
    // event.preventDefault()
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
              <div>
                {feed.notifications.map(notification => (
                  <div key={notification.message}>
                    {notification.message}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        {/* <form className='add-message' onSubmit={handleSubmit}>
          <input type='text' placeholder='Write a comment' value={message} onChange={event => setMessage(event.target.value)} />
          <button type='submit'>Post</button>
        </form> */}
      </div>
    </div>
  )
}
export default PodFeed
