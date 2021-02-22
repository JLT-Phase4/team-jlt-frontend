import { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { createTeam, unsplashApi } from '../api'
import TeamBackgroundImage from './TeamBackgroundImg'

function handleCreateTeam (event, token, handleDone, team) {
  event.preventDefault()
  const history = useHistory
  createTeam(token, team)
    .then(team => {
      if (handleDone) {
        handleDone(team)
      } else {
        history.push('/team/:teamPk')
      }
    })
}

function CreateTeam ({ token, handleDone }) {
  const [team, setTeam] = useState(null)
  const [imageQuery, setImageQuery] = useState('')
  const [imageDisplay, setImageDisplay] = useState([])
  const [isDisplaying, setIsDisplaying] = useState(false)
  const [image, setSelectedImage] = useState('')

  if (!token) {
    return <Redirect to='/login' />
  }

  function handleImgSearch (event) {
    event.preventDefault()
    unsplashApi(imageQuery).then(data => { setImageDisplay(data.results); setIsDisplaying(true) })
  }

  return (
    <div>
      <div>
        <div>
          <form onSubmit={(event) => {
            event.preventDefault()
            handleCreateTeam(event, token, handleDone)
          }}
          >
            <label htmlFor='team' />
            <input
              className='team-name-input'
              type='text'
              value={team}
              placeholder='Team Name'
              onChange={event => {
                event.preventDefault()
                setTeam(event.target.value)
              }}
            />
            <button type='submit'>Create Team</button>
          </form>
        </div>
        <div>
          <TeamBackgroundImage imageQuery={imageQuery} setImageQuery={setImageQuery} handleImgSearch={handleImgSearch} setImageDisplay={setImageDisplay} setIsDisplaying={setIsDisplaying} />
        </div>
      </div>
      <div>{`${image}`}</div>
      <div className='display-images-container'>
        {imageDisplay.map(image => (
          <div className='images' key={image.id} onClick={() => { setSelectedImage(image.urls.thumb) }}>
            <img src={image.urls.thumb} alt='images' />
          </div>
        ))}
      </div>
    </div>

  )
}

export default CreateTeam
