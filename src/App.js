
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBDropdownMenu, MDBDropdown, MDBDropdownItem, MDBDropdownToggle, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask } from 'mdbreact'

import TeamDashboard from './components/TeamDashboard'
import TeamChoreDashboard from './components/TeamChoreDashboard'
import HomeCarouselTeams from './components/HomeCarouselTeams'
import Homepage from './components/Homepage'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
// import ChoreDashboard from './components/ChoreDashboard'
import ChoreSummary from './components/ChoreSummary'
import ChoreSummaryMobile from './components/ChoreSummaryMobile'
import CreateTeamDashboard from './components/CreateTeamDashboard'
import CreateTeamMembers from './components/CreateTeamMembers'
import UserProfile from './components/UserProfile'
import HomePageScoreCards from './components/HomePageScoreCards'
import { useEffect, useState } from 'react'
import { getTeams, getPods, getUserProfile, getAssignments, updateAssignment } from './api'
import createPersistedState from 'use-persisted-state'
import Login from './components/Login'
import Register from './components/Register'
import laundryImage from './images/laundry-basket.png'
import lawnMowingImage from './images/lawn-mowing.png'
import walkingDogImage from './images/walking-dog.png'
import washingDishesImage from './images/washing-dishes.png'
import Welcome from './components/Welcome'

const useUsername = createPersistedState('username')
const useToken = createPersistedState('token')
// const useMyTeam = createPersistedState('myTeam')
// const useMyTeamName = createPersistedState('myTeamName')

function App () {
  const [teams, setTeams] = useState([])
  const [token, setToken] = useToken()
  const [username, setUsername] = useUsername()
  const [isCaptain, setCaptain] = useState(false)
  // call this isTeamCaptain
  const [today, setToday] = useState('MONDAY')
  const [todayIndex, setTodayIndex] = useState(0)
  const [myTeam, setMyTeam] = useState()
  const [team, setTeam] = useState()
  const [myPod, setMyPod] = useState()
  const [myPodFeedPk, setMyPodFeedPk] = useState()
  const [myTeamFeedPk, setMyTeamFeedPk] = useState()
  const [myTeamName, setMyTeamName] = useState()
  const [userProfile, setUserProfile] = useState()
  const [isCaptainStatus, setCaptainStatus] = useState(false)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [assignments, setAssignments] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  function setAuth (username, token) {
    setUsername(username)
    setToken(token)
  }

  // if (!token) {
  //   return <Redirect to='/login' />
  // }
  const isLoggedIn = (username && token)

  const [totalPoints, setTotalPoints] = useState()
  // useEffect(updateTeamScores, [token, teams, userProfile, setTeams, today])
  function updateTeamScores (teams) {
    const teamsTotalPoints = []
    for (const team of teams) {
      let teamTotalPoints = 0
      for (const member of team.members) {
        teamTotalPoints += member.earned_chore_points.chore__points__sum
      }
      team.teamTotalPoints = teamTotalPoints
      teamsTotalPoints.push(team.teamTotalPoints)
      setTotalPoints(team.teamTotalPoints)
    }
    teams.teamTotalPoints = teamsTotalPoints
  }
  // react context

  useEffect(updatePods, [token, username, isCreatingTeam, setIsCreatingTeam, myPod, setMyPod, setMyTeam, setTeams, setTeam, myPodFeedPk, setMyPodFeedPk, setIsLoading])
  function updatePods () {
    // setIsLoading(true)
    getPods(token)
      .then(pods => {
        // setTeams(pod.teams)
        for (const pod of pods) {
          if (pod.teams) {
            for (const team of pod.teams) {
              if (username === team.captain) {
                setCaptain(true)
                updateTeamScores(pod.teams)
                setMyTeam(team.pk)
                setTeam(team)
                if (team.feed[0]) {
                  setMyTeamFeedPk(team.feed[0].pk)
                } setMyTeamName(team.name)
                setTeams(pod.teams)
                setMyPod(pod.pk)
                if (pod.feed[0]) {
                  setMyPodFeedPk(pod.feed[0].pk)
                }
              }
              for (const member of team.members) {
                if (username === member.username) {
                  updateTeamScores(pod.teams)
                  setMyTeam(team.pk)
                  setTeam(team)
                  setMyTeamName(team.name)

                  if (team.feed[0]) {
                    setMyTeamFeedPk(team.feed[0].pk)
                  }

                  setTeams(pod.teams)
                  setMyPod(pod.pk)
                  if (pod.feed[0]) {
                    setMyPodFeedPk(pod.feed[0].pk)
                  }
                }
              }
              if (!myTeam) {
                setIsLoading(false)
              }
              // if (team.pk === myTeam) {
              //   setTeams(pod.teams)
              // } else {
              //   console.log('You are not in this pod')
              // }
            }
          }
        }
      })
  }

  useEffect(updateProfile, [token, username, myPod, myTeam, myPodFeedPk, setMyPodFeedPk, isCreatingTeam])
  const dayDict = [{ day: 'MONDAY', index: 0 }, { day: 'TUESDAY', index: 1 }, { day: 'WEDNESDAY', index: 2 },
    { day: 'THURSDAY', index: 3 }, { day: 'FRIDAY', index: 4 }, { day: 'SATURDAY', index: 5 }, { day: 'SUNDAY', index: 6 }]

  useEffect(updateAssignments, [token, today])
  function updateAssignments () {
    getAssignments(token).then(assignments => {
      setAssignments(assignments)
      // this is the rewind code for reseeding the data quickly
      // for (const day of dayDict) {
      //   for (const assignment of assignments) {
      //     if (assignment.assignment_type === day.day && todayIndex < day.index) {
      //       updateAssignment(token, assignment.pk, false).then(updateProfile())
      //     }
      //   }
      // }
    })
  }

  function updateProfile () {
    getUserProfile(token, username).then(profile => {
      setUserProfile(profile)
      if (profile.user_type === 1) {
        setCaptainStatus(true)
        console.log('I have captain status')
      }
    })
  }

  function handleTime (e) {
    setToday(e.target.value)
    if (e.target.value === 'MONDAY') {
      setTodayIndex(0)
    } else if (e.target.value === 'TUESDAY') {
      setTodayIndex(1)
    } else if (e.target.value === 'WEDNESDAY') {
      setTodayIndex(2)
    } else if (e.target.value === 'THURSDAY') {
      setTodayIndex(3)
    } else if (e.target.value === 'FRIDAY') {
      setTodayIndex(4)
    } else if (e.target.value === 'SATURDAY') {
      setTodayIndex(5)
    } else if (e.target.value === 'SUNDAY') {
      setTodayIndex(6)
    }
  }

  function handleLogout () {
    setToken(null)
    setUsername(null)
    setIsRedirecting(true)
  }

  return (
    <Router>
      <div className='chore-wars-nav'>
        <div style={{ justifyContent: 'space-between' }} className='flex chore-wars-bar'>
          <div className='flex'>
            <Link to='/' className='banner'>Chore Wars</Link>
          </div>
          {token && (
            <ul style={{ paddingTop: '10px' }} className='flex'>
              <li className=''><Link to='/'>Pod</Link></li>
              <li className=''><Link to={`/team/${myTeam}`}>Team</Link></li>
              <li className=''><Link to={`/chore-assignment/${myTeam}/`}>{isCaptain ? 'Assign Chores' : 'Chores'}</Link></li>
              {isCaptain === false &&
                <li className=''><Link to={`/user-profile/${username}`}>Profile</Link></li>}
              {isCaptain === true &&
                <li className=''><Link to={`/team-chores/${myTeam}`}>Manage Chores</Link></li>}
            </ul>
          )}
          <div style={{ paddingTop: '10px' }}>
            {isLoggedIn
              ? (
                <span><div className='logout'><span>Logged in as {username} <span style={{ marginLeft: '10px' }} onClick={() => handleLogout()}> Logout</span></span></div></span>

            // <span><div className='nav-bar-link' onClick={() => setToken(null)}>Log out</div></span>
                )
              : (null
                // <span>
                //   <Link className='' to='/login'>Login</Link> or<Link className='nav-bar-link' to='/register'>Register</Link>
                // </span>
                )}
          </div>
          {token && (
            <div className='flex'>

              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <div className='d-none d-md-inline'>Day</div>
                </MDBDropdownToggle>
                <MDBDropdownMenu right>
                  <MDBDropdownItem onClick={(e) => handleTime(e)} value='MONDAY'>Monday</MDBDropdownItem>
                  <MDBDropdownItem onClick={(e) => handleTime(e)} value='TUESDAY'>Tuesday</MDBDropdownItem>
                  <MDBDropdownItem onClick={(e) => handleTime(e)} value='WEDNESDAY'>Wednesday</MDBDropdownItem>
                  <MDBDropdownItem onClick={(e) => handleTime(e)} value='THURSDAY'>Thursday</MDBDropdownItem>
                  <MDBDropdownItem onClick={(e) => handleTime(e)} value='FRIDAY'>Friday</MDBDropdownItem>
                  <MDBDropdownItem onClick={(e) => handleTime(e)} value='SATURDAY'>Saturday</MDBDropdownItem>
                  <MDBDropdownItem onClick={(e) => handleTime(e)} value='SUNDAY'>Sunday</MDBDropdownItem>

                </MDBDropdownMenu>
              </MDBDropdown>
            </div>
          )}

        </div>
      </div>

      <Switch>

        {/* CAPTAIN REG AND LOGIN */}
        <Route path='/login'>
          <Login isLoggedIn={isLoggedIn} setAuth={setAuth} />
        </Route>
        <Route path='/register'>
          <Register isLoggedIn={isLoggedIn} setAuth={setAuth} />
        </Route>

        {/* TEAM DASHBOARD */}

        <Route path='/team/:teamPk'>
          <div className='App' />
          <TeamDashboard token={token} profileUsername={username} today={today} todayIndex={todayIndex} myPod={myPod} feedPk={myPodFeedPk} isCaptain={isCaptain} setIsCreatingTeam={setIsCreatingTeam} />
        </Route>

        <Route path='/team-chores/:teamPk'>
          <div className='App' />
          <TeamChoreDashboard token={token} teams={teams} myTeam={myTeam} myTeamName={myTeamName} />
        </Route>

        <Route path='/create-team-dashboard'>
          <div className='App' />
          <CreateTeamDashboard token={token} profileUsername={username} setMyPod={setMyPod} isCreatingTeam={isCreatingTeam} setIsCreatingTeam={setIsCreatingTeam} />
        </Route>

        {/* CHORE ASSIGNMENT PAGE */}
        <Route path='/chore-assignment/:teamPk'>
          <div className='App' />
          <ChoreSummary token={token} today={today} todayIndex={todayIndex} />
        </Route>

        <Route path='/chore-assignment-mobile/:teamPk'>
          <div className='App' />
          <ChoreSummaryMobile token={token} today={today} todayIndex={todayIndex} />
        </Route>

        <Route path='/create-team-members/:teamPk/:teamName'>
          <div className='App' />
          <CreateTeamMembers token={token} isCreatingTeam={isCreatingTeam} setIsCreatingTeam={setIsCreatingTeam} />
        </Route>

        <Route path='/user-profile/:username'>
          <div className='App' />
          <UserProfile token={token} today={today} todayIndex={todayIndex} profileUsername={username} feedPk={myTeamFeedPk} myTeam={myTeam} team={team} setTeam={setTeam} teams={teams} setTeams={setTeams} podPk={myPod} />
        </Route>

        {/* {Home Page for User Already on Team} */}

        <Route path='/'>
          {/* Turn all of this into a component to see if it handles re-rendering issues */}
          {token &&
            <div>
              {(teams && myPod)
                ? <Homepage token={token} teams={teams} myPod={myPod} isCreatingTeam={isCreatingTeam} profileUsername={username} isCaptain={isCaptain} feedPk={myPodFeedPk} today={today} isRedirecting={isRedirecting} />

                : <div>{(!isLoading) &&
                  <CreateTeamDashboard token={token} profileUsername={username} setMyPod={setMyPod} setIsCreatingTeam={setIsCreatingTeam} />}

                  </div>}

            </div>}
          {/* : <Welcome /> */}

        </Route>
      </Switch>
    </Router>
  )
}

export default App
