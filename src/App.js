
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import CarouselMemberSummary from './components/CarouselMemberSummary'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import fakeTeams from './fakeTeams'
import fakeMembers from './fakeMembers'
import MemberDashboard from './components/MemberDashboard'
import ChoreDashboard from './components/ChoreDashboard'
import DailyChoreDashboard from './components/DailyChoreDashboard'
import { useState } from 'react'
import fakeMemberChores from './fakeMemberChores'

function App () {
  const [pod, setPod] = useState('C')
  const [teams, setTeams] = useState([])
  const choreDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'anyday']

  function handleSetPod (podChoice) {
    setPod(podChoice)
    let newTeams = []
    for (const team of fakeTeams) {
      if (team.pod === podChoice) {
        newTeams = newTeams.concat(team)
      }
    }
    setTeams(newTeams)
  }

  return (
    <Router>
      <div className='flex-col-center'>
        <Link to='/' className='banner'><span style={{ fontSize: '40px' }} className='material-icons'>storm</span> Chore Wars <span style={{ fontSize: '40px' }} className='material-icons'>storm</span>      </Link>
        <span style={{ fontSize: '20px' }}>Current Pod: {pod} </span>
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

        <Route path='/create-team'>
          <div className='App' />
          <div>Create a Team Page
          </div>
        </Route>

        {/* Member chore Detail for Day Dashboard */}
        <Route path='/member/chores/:day/:username'>
          <div className='App' />
          <DailyChoreDashboard members={fakeMembers} chores={fakeMemberChores} />
        </Route>

        {/* Member chore Detail Dashboard */}
        <Route path='/member/chores/:username'>
          <div className='App' />
          <ChoreDashboard members={fakeMembers} chores={fakeMemberChores} choreDays={choreDays} />
        </Route>

        {/* member DASHBOARD */}

        <Route path='/member/:username'>
          <div className='App' />
          <MemberDashboard members={fakeMembers} choreDays={choreDays} />
        </Route>

        <Route path='/report'>
          <div>Mark my Goal Completion</div>
        </Route>

        <Route path='/'>
          <div>
            <div className='home-header flex-sa'>
              <Link to='/create-team' className='home-button'>Create a Team</Link>
              <div className='home-button' onClick={() => handleSetPod('A')}>Choose Pod A</div>
              <div className='home-button' onClick={() => handleSetPod('B')}>Choose Pod B</div>
              {(teams.length === 0)
                ? <div>
                  {fakeTeams.map((team, idx) => (
                    <div key={idx}>
                      {team.name} in Pod: {team.pod}
                    </div>
                  ))}
                  </div>
                : <>
                  {teams.map((team, idx) => (
                    <div key={idx}>
                      {(team) && (
                        <Link to={`/team/${team.teamPk}`} className='flex-col'>
                          <Card>
                            <Card.Body>
                              <div className='home-scorecard'>{team.name}<div style={{ width: '100px', height: '120px', backgroundColor: 'blue' }} /></div>
                            </Card.Body>
                          </Card>
                        </Link>
                      )}
                    </div>
                  ))}
                </>}
            </div>
            {teams.length > 0 && (
              <Carousel>
                {teams.map((team, idx) => (
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
