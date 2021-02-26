
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask } from 'mdbreact'

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
import { getTeams } from './api'
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
// const useToday = createPersistedState('today')

function App () {
  const [teams, setTeams] = useState([])
  const [token, setToken] = useToken()
  const [username, setUsername] = useUsername()
  // const today = 'TUESDAY'
  const [isCaptain, setCaptain] = useState(false)
  const [today, setToday] = useState('SUNDAY')
  const [todayIndex, setTodayIndex] = useState(0)
  const myTeam = '6'
  const myTeamName = 'Explicit Team Name!'
  const captain = true

  function setAuth (username, token) {
    setUsername(username)
    setToken(token)
  }

  const isLoggedIn = (username && token)

  useEffect(updateTeams, [token, teams])

  function updateTeams () {
    getTeams(token)
      .then(teams => setTeams(teams))
  }

  function handleTime (e) {
    setToday(e)
    console.log(e)
    if (e === 'MONDAY') {
      setTodayIndex(0)
      console.log("It's Monday")
    } else if (e === 'TUESDAY') {
      setTodayIndex(1)
      console.log("It's Tuesday")
    } else if (e === 'WEDNESDAY') {
      setTodayIndex(2)
      console.log("It's Wednesday")
    } else if (e === 'THURSDAY') {
      setTodayIndex(3)
    } else if (e === 'FRIDAY') {
      setTodayIndex(4)
    } else if (e === 'SATURDAY') {
      setTodayIndex(5)
    } else if (e === 'SUNDAY') {
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
              <Link to='/' className='banner'>Chore Wars</Link>
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
              <MDBNavItem>
                <MDBNavLink to={`/user-profile/${username}`}>My Profile</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to='/create-team-dashboard'>Create a Team</MDBNavLink>
              </MDBNavItem>
              {captain === true &&
                <MDBNavItem>
                  <MDBNavLink to={`/create-team-members/${myTeam}/${myTeamName}`}>Add Team Members</MDBNavLink>
                </MDBNavItem>}
              {captain === true &&
                <MDBNavItem>
                  <MDBNavLink to={`/team-chores/${myTeam}`}>Chore Dashboard</MDBNavLink>
                </MDBNavItem>}
              <MDBNavItem>
                <DropdownButton
                  className='time-dropdown'
                  alignRight
                  title='Select Day of Week'
                  id='current-day'
                  onSelect={(e) => handleTime(e)}
                >
                  <Dropdown.Item eventKey='MONDAY'>Monday</Dropdown.Item>
                  <Dropdown.Item eventKey='TUESDAY'>Tuesday</Dropdown.Item>
                  <Dropdown.Item eventKey='WEDNESDAY'>Wednesday</Dropdown.Item>
                  <Dropdown.Item eventKey='THURSDAY'>Thursday</Dropdown.Item>
                  <Dropdown.Item eventKey='FRIDAY'>Friday</Dropdown.Item>
                  <Dropdown.Item eventKey='SATURDAY'>Saturday</Dropdown.Item>
                  <Dropdown.Item eventKey='SUNDAY'>Sunday</Dropdown.Item>
                </DropdownButton>
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

      {/* <div className='register-and-login'>
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

      <div style={{ paddingTop: '20px' }} className='flex-col-center'>
        <div className='flex header'>
          <div className='header-bar' style={{ backgroundImage: `url(${walkingDogImage})` }} />
          <div className='header-bar' style={{ backgroundImage: `url(${laundryImage})` }} />
          <Link to='/' className='banner'>Chore Wars</Link>
          <div className='header-bar' style={{ backgroundImage: `url(${washingDishesImage})` }} />
          <div className='header-bar' style={{ marginTop: '10px', backgroundImage: `url(${lawnMowingImage})` }} />
        </div>
        <div>Time Toggle</div>
        <DropdownButton
          className='time-dropdown'
          alignRight
          title='Select Day of Week'
          id='current-day'
          onSelect={(e) => handleTime(e)}
        >
          <Dropdown.Item eventKey='MONDAY'>Monday</Dropdown.Item>
          <Dropdown.Item eventKey='TUESDAY'>Tuesday</Dropdown.Item>
          <Dropdown.Item eventKey='WEDNESDAY'>Wednesday</Dropdown.Item>
          <Dropdown.Item eventKey='THURSDAY'>Thursday</Dropdown.Item>
          <Dropdown.Item eventKey='FRIDAY'>Friday</Dropdown.Item>
          <Dropdown.Item eventKey='SATURDAY'>Saturday</Dropdown.Item>
          <Dropdown.Item eventKey='SUNDAY'>Sunday</Dropdown.Item>
        </DropdownButton>
      </div> */}

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
          <TeamChoreDashboard token={token} />
        </Route>

        <Route path='/create-team-dashboard'>
          <div className='App' />
          <CreateTeamDashboard token={token} profileUsername={username} />
        </Route>

        {/* Member Chores List Dashboard */}
        <Route path='/member/:username/chores'>
          <div className='App' />
          <ChoreDashboard token={token} />
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
        </Route>
      </Switch>
    </Router>
  )
}

export default App
