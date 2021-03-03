import { useState, useEffect } from 'react'
import { postMessage, getFeeds, getFeed } from '../api'

function PodFeed ({ token, profileUsername, today, myPod }) {
  const [message, setMessage] = useState('')
  const [feed, setFeed] = useState()
  const [feedPk, setFeedPk] = useState()

  useEffect(renderFeeds, [token, feedPk, setFeedPk])
  function renderFeeds () {
    getFeeds(token)
      .then(feeds => {
        for (const feed of feeds) {
          if (feed.pod === myPod) {
            setFeedPk(feed.pk)
            getFeed(token, feed.pk)
              .then(feed => setFeed(feed))
          }
        }
      })
  }

  console.log(feedPk)

  // function handleSubmit (event) {
  //   event.preventDefault()
  //   postMessage(token, feedPk, profileUsername, message, today)
  //     .then(data => updateFeed(data.message))
  // }

  // function updateFeed () {

  // }

  return (
    <div>
      {feed && (
        <div className='flex'>
          <div>
            {feed.notifications.map(notification => (
              <div key={notification.message}>
                <p>notification or message: "{notification.message}"</p>
                <p>message sent to {notification.target} from {notification.sender}.</p>

              </div>
            ))}
          </div>

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
