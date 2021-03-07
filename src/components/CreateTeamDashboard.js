import { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import MusicSearch from './MusicSearch'
import { createTeam, updateAssignment, updatePod } from '../api'

import BackgroundImage from './BackgroundImage'

const CreateTeamDashboard = ({ token, setMyPod, setIsCreatingTeam }) => {
  const [team, setTeam] = useState()
  const [step, countStep] = useState(1)
  const [musicTrack, setMusicTrack] = useState('')
  // const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1537440499989-de5f6b6854de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHwxMHx8a2lkc3xlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080')
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1515041219749-89347f83291a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2534&q=80')
  const [teamName, setTeamName] = useState('')
  const [teamSlogan, setTeamSlogan] = useState('')
  const [teamDashboardStyle, setTeamDashboardStyle] = useState('dodgerblue')
  // const [pod, setPod] = useState('')
  const pod = 'Pod B'
  const podPk = 2

  function handleCreateTeam () {
    createTeam(token, teamName, teamSlogan, musicTrack, backgroundImage, teamDashboardStyle).then(team => setTeam(team))
    // .then(updatePod(token, teamName, podPk))
    // .then(setIsCreatingTeam(false))
  }

  if (team) {
    // return <Redirect to='/' />
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
      <div>
        <div style={{ justifyContent: 'space-between' }} className='flex-col-center home-page-container'>
          <div className='flex-nowrap'>
            <div className='carousel-team-dashboard-container' style={{ backgroundImage: `url(${backgroundImage}`, width: '800px', height: '40vh' }}>
              <div style={{ backgroundColor: '#00000022', color: 'white' }} className='carousel-team-title'><input required onChange={(e) => setTeamName(e.target.value)} style={{ backgroundColor: '#00000022', color: 'white' }} placeholder='We are team TEAM' /></div>
              <div style={{ color: 'rgb(227, 230, 236)' }} className='team-slogan'><input required onChange={(e) => setTeamSlogan(e.target.value)} style={{ backgroundColor: '#00000022', color: 'white' }} placeholder='Your Slogan' />
              </div>
              <audio style={{ marginBottom: '20px' }} controls src={musicTrack} />
            </div>
            <div style={{ width: '370px', marginLeft: '20px' }} className='create-team-container'>
              <div style={{ color: teamDashboardStyle }} className='create-card-header'>Instructions</div>
            </div>
          </div>
          <div style={{ width: '1200px', marginLeft: '10px' }} className='create-team-container'>
            <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col' />

            {(step === 1) &&
              <div>
                <div className='create-card-header'>Step 1: Choose Team Name & Slogan in Box Above</div>
                {/* <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button'>Choose Team Name & Slogan</button> */}
                {/* <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button'> */}
                <div className='create-card-header'>Step 2: Select Team Color
                  <DropdownButton
                    className='color-dropdown'
                    alignRight
                    title='Choose Color'
                    id='display-color'
                    onSelect={(e) => setTeamDashboardStyle(e)}
                  >
                    <Dropdown.Item style={{ backgroundColor: 'crimson' }} eventKey='crimson'>Crimson</Dropdown.Item>
                    <Dropdown.Item style={{ backgroundColor: 'dodgerblue' }} eventKey='dodgerblue'>DodgerBlue</Dropdown.Item>
                    <Dropdown.Item style={{ backgroundColor: 'purple' }} eventKey='purple'>Purple</Dropdown.Item>
                  </DropdownButton>
                </div>
                {/* <button style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button' onClick={() => handleNextStep()}>Next Step</button> */}
                <button className='log-reg-button' onClick={() => handleNextStep()}>Next Step</button>

              </div>}
            {(step === 2) &&
              <div>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                <button className='log-reg-button' onClick={() => handleNextStep()}>Next</button>
                <BackgroundImage token={token} setBackgroundImage={setBackgroundImage} />
              </div>}
            {(step === 3) &&
              <div>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                <button className='log-reg-button' onClick={() => handleNextStep()}>Next</button>
                <MusicSearch token={token} setMusicTrack={setMusicTrack} />
              </div>}

            {(step === 4) &&
              <div>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                <button className='log-reg-button' onClick={() => handleCreateTeam()}>Create</button>
                <div className='create-card-header'>Step 5: Click Create to Confirm {pod} and Create Your Team</div>

                {/* <button className='log-reg-button' onClick={() => handleNextStep()}>Next</button> */}
                {/* <div>Select Your Pod or Create a New One</div> */}

              </div>}
            {/*
            {(step === 5) &&
              <div className='flex-col' style={{ textAlign: 'center' }}>
                <button className='log-reg-button' onClick={() => handlePreviousStep()}>Previous Step</button>
                <button onClick={() => handleCreateTeam()} style={{ border: `3px solid ${teamDashboardStyle}`, backgroundColor: teamDashboardStyle }} className='team-dash-button'>Create Your Team!</button>
              </div>} */}
          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateTeamDashboard
