import { useState } from 'react'
import { Redirect } from 'react-router-dom'

const CreateTeamDashboard = ({ token }) => {
  const [step, countStep] = useState(1)

  if (step === 0) {
    return <Redirect to='/' />
  }

  function handleNextStep () {
    countStep(step + 1)
  }
  function handlePreviousStep () {
    countStep(step - 1)
  }
  const handleDone = () => {
    countStep(0)
  }
  return (

  // team.name
  // team.slogan
  // team.background_image
  // team.dashboard_style
  // team.theme_song
    <div>
      {/* <div className='flex' style={{ textAlign: 'center' }}> */}
      <div className='flex'>
        <div className='team-dashboard-container' style={{ backgroundColor: 'crimson' }}>
          <div className='team-title'><input style={{ backgroundColor: '#00000022', color: 'white' }} placeholder='We are team TEAM' /></div>
          <div className='team-slogan'>Your slogan!
            <audio controls style={{ width: '140px', height: '15px' }} src='' />
          </div>
          <div className='team-scoreblock flex' />
        </div>
        <div style={{ border: '3px solid green', backgroundColor: 'green' }} className='team-feed-container'>
          <h1>Feed will go here:</h1>
          <ul />
        </div>
      </div>
      {/* </div> */}
      {(step === 1) &&
        <div className='animate__animated animate__fadeInLeft' style={{ textAlign: 'center' }}>Add Team Name and Team Slogan
          <button onClick={() => handleNextStep()}>Next Step</button>
        </div>}
      {(step === 2) &&
        <div className='animate__animated animate__fadeInLeft' style={{ textAlign: 'center' }}>
          Search for Background Image<input />
          <button onClick={() => handlePreviousStep()}>Previous Step</button>
          <button onClick={() => handleNextStep()}>Next Step</button>
          <div className='search-results-container' style={{ border: 'solid 2px' }}>Search Results</div>
        </div>}
      {(step === 3) &&
        <div className='animate__animated animate__fadeInLeft' style={{ textAlign: 'center' }}>
          Search for Team Theme Song<input />
          <button onClick={() => handlePreviousStep()}>Previous Step</button>
          <button onClick={() => handleNextStep()}>Next</button>
          <div className='search-results-container' style={{ border: 'solid 2px' }}>Search Results</div>
        </div>}
      {(step === 4) &&
        <div className='animate__animated animate__fadeInLeft' style={{ textAlign: 'center' }}>Complete Create Team
          <button onClick={() => handlePreviousStep()}>Previous Step</button>
          <button onClick={() => handleDone()}>Create Team</button>
        </div>}

    </div>
  )
}

export default CreateTeamDashboard
