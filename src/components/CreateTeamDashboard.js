import { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import MusicSearch from './MusicSearch'
import { createTeam, updateAssignment, updatePod } from '../api'

import BackgroundImage from './BackgroundImage'

const CreateTeamDashboard = ({ token, isCreatingTeam, setIsCreatingTeam, setMyPod }) => {
  const [team, setTeam] = useState()
  const [step, countStep] = useState(1)
  const [musicTrack, setMusicTrack] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1537440499989-de5f6b6854de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHwxMHx8a2lkc3xlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080')
  const [teamName, setTeamName] = useState('')
  const [teamSlogan, setTeamSlogan] = useState('')
  const [teamDashboardStyle, setTeamDashboardStyle] = useState('gold')
  // const [pod, setPod] = useState('')
  const pod = 'Pod B'
  const podPk = 2

  function handleCreateTeam () {
    createTeam(token, teamName, teamSlogan, musicTrack, backgroundImage, teamDashboardStyle).then(team => setTeam(team))
    // .then(updatePod(token, teamName, podPk))
    // .then(setIsCreatingTeam(false))
  }

  if (team) {
    // return <Redirect to={`/team/${team.pk}`} />
    updatePod(token, teamName, podPk)
    setIsCreatingTeam(false)
    setMyPod(podPk)
    return <Redirect to={`/team/${team.pk}`} />
  }

  function handleNextStep () {
    countStep(step + 1)
  }
  function handlePreviousStep () {
    countStep(step - 1)
  }

  return (
    <div>
      {/* {isCreatingTeam && ( */}

      <div>
        {/* <div className='flex'>
            <div className='team-dashboard-container' style={{ backgroundColor: 'crimson', backgroundImage: `url(${backgroundImage}` }}>
              <div className='team-title'><input required onChange={(e) => setTeamName(e.target.value)} style={{ backgroundColor: '#00000022', color: 'white' }} placeholder='We are team TEAM' /></div>
              <div className='team-slogan'><input required onChange={(e) => setTeamSlogan(e.target.value)} style={{ backgroundColor: '#00000022', color: 'white' }} placeholder='Your Slogan' />
                <audio controls style={{ width: '140px', height: '15px' }} src={musicTrack} />
              </div>
              <div className='team-scoreblock flex' />
            </div>
            <div style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: `${teamDashboardStyle}` }} className='team-feed-container'>
              <h1>Feed will go here:</h1>
              <ul />
            </div>
          </div> */}

        <div className='flex'>
          <div className='team-chore-mini' style={{ backgroundImage: `url(${backgroundImage}` }}>
            <div className='team-title'><input required onChange={(e) => setTeamName(e.target.value)} style={{ backgroundColor: '#00000022', color: 'white' }} placeholder='We are team TEAM' /></div>
            <div className='team-slogan'><input required onChange={(e) => setTeamSlogan(e.target.value)} style={{ backgroundColor: '#00000022', color: 'white' }} placeholder='Your Slogan' />
              <audio controls style={{ width: '140px', height: '15px' }} src={musicTrack} />
            </div>
          </div>
          <div className='create-team-container' style={{ border: `3px solid ${teamDashboardStyle}` }}>
            <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col' />

            {(step === 1) &&
              <div>
                <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button'>Choose Team Name & Slogan</button>
                <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button'>
                  <DropdownButton
                    className='color-dropdown'
                    alignRight
                    title='Select Team Color'
                    id='display-color'
                    onSelect={(e) => setTeamDashboardStyle(e)}
                  >
                    <Dropdown.Item style={{ backgroundColor: 'crimson' }} eventKey='crimson'>Crimson</Dropdown.Item>
                    <Dropdown.Item style={{ backgroundColor: 'dodgerblue' }} eventKey='dodgerblue'>DodgerBlue</Dropdown.Item>
                    <Dropdown.Item style={{ backgroundColor: 'purple' }} eventKey='purple'>Purple</Dropdown.Item>
                  </DropdownButton>
                </button>
                <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button' onClick={() => handleNextStep()}>Next Step</button>
              </div>}
            {(step === 2) &&
              <div style={{ textAlign: 'center' }}>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                <button className='log-reg-button' onClick={() => handleNextStep()}>Next</button>
                <BackgroundImage token={token} setBackgroundImage={setBackgroundImage} />
              </div>}
            {(step === 3) &&
              <div style={{ textAlign: 'center' }}>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                <button className='log-reg-button' onClick={() => handleNextStep()}>Next</button>
                <MusicSearch token={token} setMusicTrack={setMusicTrack} />
              </div>}

            {(step === 4) &&
              <div className='flex-col' style={{ textAlign: 'center' }}>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                {/* <button className='log-reg-button' onClick={() => handleNextStep()}>Next</button> */}
                {/* <div>Select Your Pod or Create a New One</div> */}
                <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} onClick={() => handleNextStep()} className='team-dash-button'>Enter Pod Code</button>
                <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} onClick={() => handleNextStep()} className='team-dash-button'>Choose a New Pod</button>

              </div>}

            {(step === 5) &&
              <div className='flex-col' style={{ textAlign: 'center' }}>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                <button onClick={() => handleCreateTeam()} style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button'>Create Your Team!</button>
              </div>}
          </div>

        </div>

      </div>
      {/* )} */}
    </div>
  )
}

export default CreateTeamDashboard
