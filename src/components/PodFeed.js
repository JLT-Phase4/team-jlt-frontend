import { useState, useEffect } from 'react'
import { postMessage, getFeeds, getFeed } from '../api'

function PodFeed ({ token, profileUsername, today, myPod }) {
  const [message, setMessage] = useState('')
  const [feed, setFeed] = useState()
  const [feedPk, setFeedPk] = useState()

  // console.log(myPod)

  useEffect(renderFeeds, [token])
  function renderFeeds () {
    // console.log(myPod)
    getFeeds(token)
      .then(feeds => {
        for (const feed of feeds) {
          console.log(feed)
          // console.log(myPod)
          if (feed.pod === myPod) {
            console.log(myPod)
            console.log(feed.pod)
            getFeed(token, feed.pk)
              .then(feed => setFeed(feed))
          }
        }
      })
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
      {feed && (
        <div className='flex'>
          <div>
            {feed.notifications.map(notification => (
              <div key={notification.message}>
                {notification.message}
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
