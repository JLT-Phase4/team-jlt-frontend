import { useState, useEffect } from 'react'
import { postMessage, getFeed } from './../api'

function TeamFeed ({teamPk}) {
  const [message, setMessage] = useState('')
  const [feed, setFeed] = useState()

  useEffect(renderFeed, [token, teamPk])

  function renderFeed() {
    event.preventDefault()
    getFeed(token, teamPk)
      .then(feed => setFeed(feed) )
  }

//   function handleAddMessage (event) {
//     event.preventDefault()
//     postMessage(token, teamPk, author, message)
//       .then(data => updateFeed(data.message))
//   }

//   function updateFeed() {
//     // setMessageList by pushing new message onto end of array
//   }

  return (
    <div className='flex'>
      {chores.map(chore => (
        <ul key={chore.pk}>
          <li
            draggable
            onDragStart={(event) => { handleDragStart(event, { chore }) }}
          >{chore.name}
          </li>
        </ul>
      ))}
    </div>
 
    <div>
        <form className='add-message' onSubmit={handleAddMessage}>
        <input type='text' placeholder='Write a comment' value={message} onChange={event => setMessage(event.target.value)} />
        <button type='submit'>Post</button>
        </form>
    </div>
  )
}
export default TeamFeed
