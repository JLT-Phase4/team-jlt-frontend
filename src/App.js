
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBDropdownMenu, MDBDropdown, MDBDropdownItem, MDBDropdownToggle, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask } from 'mdbreact'

import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import TeamChoreDashboard from './components/TeamChoreDashboard'
import HomeCarouselTeams from './components/HomeCarouselTeams'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import ChoreDashboard from './components/ChoreDashboard'
import ChoreRecordDetail from './components/ChoreRecordDetail'
import CreateTeamDashboard from './components/CreateTeamDashboard'
import CreateTeamMembers from './components/CreateTeamMembers'
import UserProfile from './components/UserProfile'
import DailyChoreDashboard from './components/DailyChoreDashboard'
import HomePageScoreCards from './components/HomePageScoreCards'
import { useEffect, useState } from 'react'
import { getTeams, getUserProfile } from './api'
import createPersistedState from 'use-persisted-state'
import Login from './components/Login'
import Register from './components/Register'
import laundryImage from './images/laundry-basket.png'
import lawnMowingImage from './images/lawn-mowing.png'
import walkingDogImage from './images/walking-dog.png'
import washingDishesImage from './images/washing-dishes.png'
import ChoreAssignment from './components/ChoreAssignment'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const useUsername = createPersistedState('username')
const useToken = createPersistedState('token')
// const useMyTeam = createPersistedState('myTeam')
// const useMyTeamName = createPersistedState('myTeamName')

function App () {
  const [teams, setTeams] = useState([])
  const [token, setToken] = useToken()
  // const [token, setToken] = useState()
  const [username, setUsername] = useUsername()
  // const [username, setUsername] = useState()
  const [isCaptain, setCaptain] = useState(false)
  const [today, setToday] = useState('SUNDAY')
  const [todayIndex, setTodayIndex] = useState(0)
  // const [myTeam, setMyTeam] = useMyTeam()
  const [myTeam, setMyTeam] = useState()
  // const [myTeamName, setMyTeamName] = useMyTeamName()
  const [myTeamName, setMyTeamName] = useState()
  const [userProfile, setUserProfile] = useState()
  const [isCaptainStatus, setCaptainStatus] = useState(false)

  function setAuth (username, token) {
    setUsername(username)
    setToken(token)
  }

  const isLoggedIn = (username && token)

  useEffect(updateTeams, [token, username, setUsername, setToken])

  function updateTeams () {
    getTeams(token)
      .then(teams => setTeams(teams))
    if (teams) {
      for (const team of teams) {
        console.log(username, team.captain)
        if (username === team.captain) {
          setCaptain(true)
          setMyTeam(team.pk)
          setMyTeamName(team.name)
          console.log('I am captain of:')
          console.log(team.pk)
          console.log(team.name)
        }
        // else {
        //   setMyTeam()
        //   setMyTeamName()
        // }
        for (const member of team.members) {
          if (username === member.username) {
            console.log('setting team to: ', team.pk)
            setMyTeam(team.pk)
            setMyTeamName(team.name)
          }
          // else {
          //   setMyTeam()
          //   setMyTeamName()
          // }
        }
      }
    }
  }

  useEffect(updateProfile, [token, username])

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
    console.log(e)
    if (e.target.value === 'MONDAY') {
      setTodayIndex(0)
      console.log("It's Monday")
    } else if (e.target.value === 'TUESDAY') {
      setTodayIndex(1)
      console.log("It's Tuesday")
    } else if (e.target.value === 'WEDNESDAY') {
      setTodayIndex(2)
      console.log("It's Wednesday")
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
      <MDBNavbar color='black' fixed='top' dark expand='md'>
        <MDBContainer>
          <MDBNavbarBrand href='/'>
            {/* <strong>Navbar</strong> */}
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
              {isCaptainStatus === false &&
                <MDBNavItem>
                  <MDBNavLink to={`/user-profile/${username}`}>My Profile</MDBNavLink>
                </MDBNavItem>}
              {isCaptainStatus === true && isCaptain === false &&
                <MDBNavItem>
                  <MDBNavLink to='/create-team-dashboard'>Create a Team</MDBNavLink>
                </MDBNavItem>}
              {isCaptain === true &&
                <MDBNavItem>
                  <MDBNavLink to={`/create-team-members/${myTeam}/${myTeamName}`}>Add Team Members</MDBNavLink>
                </MDBNavItem>}
              {isCaptain === true &&
                <MDBNavItem>
                  <MDBNavLink to={`/team-chores/${myTeam}`}>Chore Dashboard</MDBNavLink>
                </MDBNavItem>}
              <MDBNavItem>

                <MDBDropdown>
                  <MDBDropdownToggle nav caret>
                    <div className='d-none d-md-inline'>Select Day</div>
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
      </MDBNavbar>

      <Switch>

        {/* CAPTAIN REG AND LOGIN */}
        <Route path='/login'>
          <Login isLoggedIn={isLoggedIn} setAuth={setAuth} />
        </Route>
        <Route path='/register'>
          <Register isLoggedIn={isLoggedIn} setAuth={setAuth} />
        </Route>

        <Route path='/teams'>
          <div className='App' />
          <TeamList />
        </Route>

        {/* TEAM DASHBOARD */}

        <Route path='/team/:teamPk'>
          <div className='App' />
          <TeamDashboard token={token} profileUsername={username} today={today} todayIndex={todayIndex} />
        </Route>

        <Route path='/team-chores/:teamPk'>
          <div className='App' />
          <TeamChoreDashboard token={token} teams={teams} myTeam={myTeam} myTeamName={myTeamName} />
        </Route>

        <Route path='/create-team-dashboard'>
          <div className='App' />
          <CreateTeamDashboard token={token} profileUsername={username} setTeams={setTeams} />
        </Route>

        {/* Member Chores List Dashboard */}
        <Route path='/member/:username/chores'>
          <div className='App' />
          {teams && (
            <ChoreDashboard token={token} />

          )}
        </Route>

        {/* Member chore Detail for Day Dashboard */}
        <Route path='/member/:username/:day/chores'>
          <div className='App' />
          <DailyChoreDashboard token={token} today={today} todayIndex={todayIndex} />
        </Route>

        {/* Member Chore Detail Dashboard */}
        <Route path='/choredetail/:chorePk'>
          <div className='App' />
          <ChoreRecordDetail token={token} />
        </Route>

        {/* CHORE ASSIGNMENT PAGE */}
        <Route path='/chore-assignment/:teamPk'>
          <div className='App' />
          <ChoreAssignment token={token} />
        </Route>

        <Route path='/create-team-members/:teamPk/:teamName'>
          <div className='App' />
          <CreateTeamMembers token={token} />
        </Route>

        <Route path='/user-profile/:username'>
          <div className='App' />
          <UserProfile token={token} today={today} todayIndex={todayIndex} profileUsername={username} />
        </Route>

        {/* {Home Page for User Already on Team} */}

        <Route path='/'>
          <div className='App' />
          {teams && (

            <div>
              <Carousel>
                {teams.map((team, idx) => (
                  <Carousel.Item key={idx} className='carousel-holder'>
                    {team && (
                      <div className='flex-col'>
                        <Card>
                          <Card.Body>
                            <HomeCarouselTeams team={team} displayHeight='50vh' />
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </Carousel.Item>
                ))}
              </Carousel>
              <HomePageScoreCards teams={teams} isCaptain={isCaptain} profileUsername={username} />

              <div className='footer-feed'>Latest Notification Feed</div>
            </div>
          )}

        </Route>
      </Switch>
    </Router>
  )
}

export default App
