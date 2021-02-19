
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import MemberSummary from './components/MemberSummary'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import fakeTeams from './fakeTeams'
import fakeMembers from './fakeMembers'
import MemberDashboard from './components/MemberDashboard'
import { useEffect, useState } from 'react'

function App () {
  const [pod, setPod] = useState('A')
  const [teams, setTeams] = useState([])
  useEffect(handleSetTeams, [])

  function handleSetTeams () {
    let newTeams = []
    for (const team of fakeTeams) {
      if (team.pod === pod) {
        newTeams = newTeams.concat(team)
      }
    }
    setTeams(newTeams)
  }

  function handleSetPod (podChoice) {
    setPod(podChoice)
    handleSetTeams()
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
          <div className='App'>
            {/* <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/create-team'>Create a Team</Link>
              <Link to='/teams'>List Teams</Link>
              <Link to='/my-profile'>Member Profile</Link>
            </header> */}
          </div>
          <TeamList />
        </Route>

        {/* TEAM DASHBOARD */}

        <Route path='/team/:teamPk'>
          <div className='App'>
            {/* <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/create-team'>Create a Team</Link>
              <Link to='/teams'>List Teams</Link>
              <Link to='/my-profile'>Member Profile</Link>
            </header> */}
          </div>
          <TeamDashboard teams={fakeTeams} />
        </Route>

        <Route path='/create-team'>
          <div className='App'>
            {/* <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/member/elmerfudd'>Elmer Fudd</Link>
              <Link to='/member/jessicarabbit'>Jessica Rabbit</Link>
              <Link to='/member/bettyboop'>Betty Boop</Link>
            </header> */}
          </div>
          <div>Create a Team Page
          </div>
        </Route>

        {/* member DASHBOARD */}

        <Route path='/member/:username'>
          <div className='App'>
            {/* <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/member/elmerfudd'>Elmer Fudd</Link>
              <Link to='/member/jessicarabbit'>Jessica Rabbit</Link>
              <Link to='/member/bettyboop'>Betty Boop</Link>
            </header> */}
          </div>
          <MemberDashboard members={fakeMembers} />
        </Route>

        <Route path='/report'>
          <div>Mark my Goal Completion</div>
        </Route>

        <Route path='/'>
          <div className='home-header flex-sa'>
            <Link to='/create-team' className='home-button'>Create a Team</Link>
            <div className='home-button' onClick={() => handleSetPod('A')}>Choose Pod A</div>
            <div className='home-button' onClick={() => handleSetPod('B')}>Choose Pod B</div>
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
          </div>
          <Carousel>
            {teams.map((team, idx) => (
              <Carousel.Item key={idx} className='carousel-holder'>
                {team && (
                  <div className='flex-col'>
                    <Card>
                      <Card.Body>
                        <MemberSummary team={team} displayHeight='40vh' />
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Carousel.Item>
            ))}
          </Carousel>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
