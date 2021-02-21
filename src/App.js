
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import HomeCarouselTeams from './components/HomeCarouselTeams'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import ChoreDashboard from './components/ChoreDashboard'
import ChoreDetail from './components/ChoreDetail'
import DailyChoreDashboard from './components/DailyChoreDashboard'
import HomePageScoreCards from './components/HomePageScoreCards'
import { useEffect, useState } from 'react'
import { getTeams } from './api'

function App () {
  const [teams, setTeams] = useState([])
  const token = '805756d894563ce3f8a0f5c8c4bb5ae8a234ccf8'

  useEffect(updateTeams, [token])

  function updateTeams () {
    getTeams(token)
      .then(teams => setTeams(teams))
  }

  return (
    <Router>
      <div className='flex-col-center'>
        <Link to='/' className='banner'><span style={{ fontSize: '40px' }} className='material-icons'>storm</span> Chore Wars <span style={{ fontSize: '40px' }} className='material-icons'>storm</span>      </Link>
      </div>
      <Switch>
        <Route path='/teams'>
          <div className='App' />
          <TeamList />
        </Route>

        {/* TEAM DASHBOARD */}

        <Route path='/team/:teamPk'>
          <div className='App' />
          <TeamDashboard token={token} />
        </Route>

        {/* Member Chores List Dashboard */}
        <Route path='/member/:username/chores'>
          <div className='App' />
          <ChoreDashboard token={token} />
        </Route>

        {/* Member chore Detail for Day Dashboard */}
        <Route path='/member/:username/:day/chores'>
          <div className='App' />
          <DailyChoreDashboard token={token} />
        </Route>

        {/* Member Chore Detail Dashboard */}
        <Route path='/choredetail/:chorePk'>
          <div className='App' />
          <ChoreDetail token={token} />
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
