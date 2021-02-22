
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import HomeCarouselTeams from './components/HomeCarouselTeams'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import ChoreDashboard from './components/ChoreDashboard'
import ChoreDetail from './components/ChoreDetail'
import ChoreRecordDetail from './components/ChoreRecordDetail'
import CreateTeamDashboard from './components/CreateTeamDashboard'

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
import CreateTeam from './components/CreateTeam'

const useUsername = createPersistedState('username')
const useToken = createPersistedState('token')
const useToday = createPersistedState('today')

function App () {
  const [teams, setTeams] = useState([])
  // const token = '805756d894563ce3f8a0f5c8c4bb5ae8a234ccf8'
  const [token, setToken] = useToken()
  const [username, setUsername] = useUsername()
  const [today] = useToday('SUN')

  function setAuth (username, token) {
    setUsername(username)
    setToken(token)
  }

  const isLoggedIn = (username && token)

  useEffect(updateTeams, [token])

  function updateTeams () {
    getTeams(token)
      .then(teams => setTeams(teams))
  }

  return (
    <Router>

      <div style={{ paddingTop: '20px' }} className='flex-col-center'>
        {/* <Link to='/' className='banner'><span style={{ fontSize: '40px' }} className='material-icons'>storm</span> Chore Wars <span style={{ fontSize: '40px' }} className='material-icons'>storm</span>      </Link> */}
        <div className='flex'>
          <div className='header-bar' style={{ backgroundImage: `url(${walkingDogImage})` }} />
          <div className='header-bar' style={{ backgroundImage: `url(${laundryImage})` }} />
          <Link to='/' className='banner'>Chore Wars</Link>
          <div className='header-bar' style={{ backgroundImage: `url(${washingDishesImage})` }} />
          <div className='header-bar' style={{ marginTop: '10px', backgroundImage: `url(${lawnMowingImage})` }} />

        </div>
      </div>


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
          <TeamDashboard token={token} username={username} today={today} />
        </Route>

        <Route path='/create-team'>
          <div className='App' />
          {/* <TeamDashboard token={token} /> */}
          <CreateTeam token={token} />
        </Route>

        <Route path='/create-team-dashboard'>
          <div className='App' />
          <CreateTeamDashboard token={token} />
        </Route>

        {/* Member Chores List Dashboard */}
        <Route path='/member/:username/chores'>
          <div className='App' />
          <ChoreDashboard token={token} />
        </Route>

        {/* Member chore Detail for Day Dashboard */}
        <Route path='/member/:username/:day/chores'>
          <div className='App' />
          <DailyChoreDashboard token={token} today={today} />
        </Route>

        {/* Member Chore Detail Dashboard */}
        <Route path='/choredetail/:chorePk'>
          <div className='App' />
          <ChoreRecordDetail token={token} />
        </Route>

        {/* {Home Page for User Already on Team} */}

        <Route path='/'>
          <div>
            <HomePageScoreCards teams={teams} />
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
            <div className='footer-feed'>Latest Notification Feed</div>

          </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
