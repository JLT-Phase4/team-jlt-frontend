import { useState } from 'react'
import { postMessage } from './../api'

function TeamFeed () {
  const [message, setMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  function handleAddMessage (event) {
    event.preventDefault()
    postMessage(token, teamFeed, author, message)
      .then(data => updateMessageList(data.message))
  }

  function updateMessageList () {
    // setMessageList by pushing new message onto end of array
  }

  return (
    <form className='add-message' onSubmit={handleAddMessage}>
      <input type='text' placeholder='Write a comment' value={message} onChange={event => setMessage(event.target.value)} />
      <button type='submit'>Post</button>
    </form>

  )
}
export default TeamFeed
