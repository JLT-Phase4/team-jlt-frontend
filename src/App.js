
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
  const [myPod, setMyPod] = useState()
  const [myPodFeedPk, setMyPodFeedPk] = useState()
  const [myTeamFeedPk, setMyTeamFeedPk] = useState()
  const [myTeamName, setMyTeamName] = useState()
  const [userProfile, setUserProfile] = useState()
  const [isCaptainStatus, setCaptainStatus] = useState(false)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [assignments, setAssignments] = useState()

  function setAuth (username, token) {
    setUsername(username)
    setToken(token)
  }

  const isLoggedIn = (username && token)

  useEffect(updatePods, [token, username, isCreatingTeam, setIsCreatingTeam, myPod, setMyPod, myPodFeedPk, setMyPodFeedPk])
  function updatePods () {
    getPods(token)
      .then(pods => {
        // setTeams(pod.teams)
        for (const pod of pods) {
          if (pod.teams) {
            for (const team of pod.teams) {
              if (username === team.captain) {
                setCaptain(true)
                setMyTeam(team.pk)
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
                  setMyTeam(team.pk)
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

  useEffect(updateProfile, [token, username, myPod, myTeam, myPodFeedPk, setMyPodFeedPk])
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

  return (
    <Router>
      <nav className='navbar navbar-inverse'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <Link className='navbar-brand' to='/'>
              {/* <div className='header-bar' style={{ backgroundImage: `url(${walkingDogImage})` }} /> */}
              <div className='header-bar' style={{ backgroundImage: `url(${laundryImage})` }} />
              <Link to='/' className='banner'>Chore Wars</Link>
              {/* <div className='header-bar' style={{ backgroundImage: `url(${washingDishesImage})` }} /> */}
              {/* <div className='header-bar' style={{ marginTop: '10px', backgroundImage: `url(${lawnMowingImage})` }} /> */}
            </Link>
          </div>
          <ul className='nav-bar-links flex'>
            <li className='nav-bar-link' class='active'><Link to='/'>My Pod</Link></li>
            <li className='nav-bar-link'><Link to={`/team/${myTeam}`}>My Team</Link></li>
            <li className='nav-bar-link'><Link to={`/chore-assignment/${myTeam}/`}>Team Chores</Link></li>
            <li className='nav-bar-link'><Link to={`/user-profile/${username}`}>My Profile</Link></li>
            {isLoggedIn
              ? (
                <span><div className='nav-bar-link' onClick={() => setToken(null)}>Log out</div></span>
                )
              : (
                <span>
                  <Link className='nav-bar-link' to='/login'>Login</Link> or<Link className='nav-bar-link' to='/register'>Register</Link>
                </span>
                )}
          </ul>

          <ul className='nav-bar-links flex'>
            {/* <Link to='/login'><button className='log-button'>Login</button></Link> or <Link to='/register'><button className='reg-button'>Register</button></Link> */}

            {/* <li><Link to='/login'><span class='glyphicon glyphicon-log-in' /> Login</Link><span> or </span><Link to='/register'>Sign Up</Link></li> */}
            {/* <li><span>Hello {username}!</span><Link href='accounts/logout/' onClick={() => setToken(null)}><span class='glyphicon glyphicon-log-in' /> LogOut</Link></li> */}
            {/* <li><Link href='accounts/logout/' onClick={() => setToken(null)}><span class='glyphicon glyphicon-log-in' /> Logout</Link></li> */}

            <li>
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
            </li>
          </ul>
        </div>
      </nav>

      {/* <MDBNavbar color='black' dark expand='md'>
        <MDBContainer>
          <MDBNavbarBrand href='/'>
            <div className='flex header'>
              <div className='header-bar' style={{ backgroundImage: `url(${walkingDogImage})` }} />
              <div className='header-bar' style={{ backgroundImage: `url(${laundryImage})` }} />
              <MDBNavLink to='/' className='banner'>Chore Wars</MDBNavLink>
              <div className='header-bar' style={{ backgroundImage: `url(${washingDishesImage})` }} />
              <div className='header-bar' style={{ marginTop: '10px', backgroundImage: `url(${lawnMowingImage})` }} />
            </div>
          </MDBNavbarBrand>
          <MDBNavbarToggler />
          <MDBCollapse navbar>
            <MDBNavbarNav left>
              <MDBNavItem active>
                <MDBNavLink to='/'>Home</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to={`/team/${myTeam}/`}>My Team</MDBNavLink>
              </MDBNavItem>
              {isCaptain === false &&
                <MDBNavItem>
                  <MDBNavLink to={`/user-profile/${username}`}>My Profile</MDBNavLink>
                </MDBNavItem>}
              <MDBNavItem>
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
              </MDBNavItem>
              <MDBNavItem>

                <div className='register-and-login'>
                  {isLoggedIn
                    ? (
                      <span>Hello, {username} <button className='logout-button' onClick={() => setToken(null)}>Log out</button></span>
                      )
                    : (
                      <span>
                        <Link to='/login'><button className='log-button'>Login</button></Link> or <Link to='/register'><button className='reg-button'>Register</button></Link>
                      </span>
                      )}
                </div>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>

        </MDBContainer>
      </MDBNavbar> */}

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
          <TeamDashboard token={token} profileUsername={username} today={today} todayIndex={todayIndex} myPod={myPod} feedPk={myPodFeedPk} />
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
          <CreateTeamMembers token={token} />
        </Route>

        <Route path='/user-profile/:username'>
          <div className='App' />
          <UserProfile token={token} today={today} todayIndex={todayIndex} profileUsername={username} feedPk={myTeamFeedPk} myTeam={myTeam} />
        </Route>

        {/* {Home Page for User Already on Team} */}

        <Route path='/'>
          {/* Turn all of this into a component to see if it handles re-rendering issues */}
          {token &&
            <div>
              {teams && myPod && (
                <Homepage token={token} teams={teams} myPod={myPod} profileUsername={username} isCaptain={isCaptain} feedPk={myPodFeedPk} today={today} />
              )}

              {/* <CreateTeamDashboard token={token} profileUsername={username} setMyPod={setMyPod} />} */}

            </div>}
          {/* : <Welcome /> */}

        </Route>
      </Switch>
    </Router>
  )
}

export default App
