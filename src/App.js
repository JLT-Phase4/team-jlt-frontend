
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import fakeTeams from './fakeTeams'

function App () {
  return (
    <Router>
      <Switch>
        <Route path='/teams'>
          <div className='App'>
            <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/create-team'>Create a Team</Link>
              <Link to='/teams'>List Teams</Link>
              <Link to='/my-profile'>Member Profile</Link>
            </header>
          </div>
          <TeamList />
        </Route>
        <Route path='/team/:teamPk'>
          <div className='App'>
            <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/create-team'>Create a Team</Link>
              <Link to='/teams'>List Teams</Link>
              <Link to='/my-profile'>Member Profile</Link>
            </header>
          </div>
          <TeamDashboard teams={fakeTeams} />
        </Route>
        <Route path='/create-team'>
          <div className='App'>
            <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/create-team'>Create a Team</Link>
              <Link to='/teams'>List Teams</Link>
              <Link to='/my-profile'>Member Profile</Link>
            </header>
          </div>
          <div>Create a Team Page
          </div>
        </Route>
        <Route path='/my-profile'>
          <div className='App'>
            <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/create-team'>Create a Team</Link>
              <Link to='/teams'>List Teams</Link>
              <Link to='/my-profile'>Member Profile</Link>
            </header>
          </div>
          <div>My Profile Page</div>
        </Route>
        <Route path='/report'>
          <div>Mark my Goal Completion</div>
        </Route>
        <Route path='/'>
          <div className='home-header flex-sa'>
            <div className='home-button'>Create a Team</div>
            <div className='home-button'>Join a Team</div>
            <Link to='/teams' className='home-button'>Your Teams</Link>
          </div>
          <Carousel className='carousel-holder'>
            {fakeTeams.map((team, idx) => (
              <Carousel.Item key={idx}>
                <div className='flex-col'>
                  <Card>
                    <Card.Body>
                      {team && (
                        <TeamDashboard showTeam={team} />
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
