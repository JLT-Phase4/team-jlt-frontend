
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import CarouselMemberSummary from './components/CarouselMemberSummary'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import fakeTeams from './fakeTeams'
import { useState } from 'react'

function App () {
  return (
    <Router>
      <div className='flex-col-center'>
        <Link to='/' className='banner'><span style={{ fontSize: '40px' }} className='material-icons'>storm</span> Chore Wars <span style={{ fontSize: '40px' }} className='material-icons'>storm</span>      </Link>
        <div className='footer-feed'>Latest Notification Feed</div>
      </div>
      <Switch>
        <Route path='/teams'>
          <div className='App' />
          <TeamList />
        </Route>

        {/* TEAM DASHBOARD */}

        <Route path='/team/:teamPk'>
          <div className='App' />
          <TeamDashboard teams={fakeTeams} />
        </Route>

        <Route path='/'>
          <div>
            <div className='home-header flex-sa'>
              {fakeTeams.map((team, idx) => (
                <div key={idx}>
                  {(team) && (
                    <Link to={`/team/${team.pk}`} className='flex-col'>
                      <Card>
                        <Card.Body>
                          <div className='home-scorecard'>{team.name}
                            <div style={{ height: '105px', width: '80px', backgroundColor: '#3a93eb' }} />
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  )}
                </div>
              ))}

            </div>
              <Carousel>
                {fakeTeams.map((team, idx) => (
                  <Carousel.Item key={idx} className='carousel-holder'>
                    {team && (
                      <div className='flex-col'>
                        <Card>
                          <Card.Body>
                            <CarouselMemberSummary team={team} displayHeight='50vh' />
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </Carousel.Item>
                ))}
              </Carousel>
            )}

          </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
