import { useState, useEffect } from 'react'
import { postMessage } from '../api'

function PodFeed ({ token, profileUsername, today, myPod, feed }) {
  const [message, setMessage] = useState('')

  // function handleSubmit (event) {
  //   event.preventDefault()
  //   postMessage(token, feed.pk, profileUsername, message, today)
  //     .then(data => updateFeed(data.message))
  // }

  // function updateFeed () {

  // }

  return (
    <div>
      {feed && (
        <div>
          <div className='flex'>
            <div>
              {feed.notifications.map(notification => (
                <div key={notification.message + notification.target + today}>
                  <p>notification or message: "{notification.message}"</p>
                  <p>message sent to {notification.target} from {notification.sender}.</p>

                </div>
              ))}
            </div>

          </div>
          <div>
            <form className='add-message'>
              <input type='text' placeholder='Write a comment' value={message} onChange={event => setMessage(event.target.value)} />
              <button type='submit'>Post</button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default PodFeed
