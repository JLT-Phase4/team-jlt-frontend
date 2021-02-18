
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import TeamList from './components/TeamList'
import TeamDashboard from './components/TeamDashboard'
import MemberSummary from './components/MemberSummary'
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import fakeTeams from './fakeTeams'
import fakeUsers from './fakeUsers'
import MemberDashboard from './components/MemberDashboard'

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

        {/* TEAM DASHBOARD */}

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
              <Link to='/user/elmerfudd'>Elmer Fudd</Link>
              <Link to='/user/jessicarabbit'>Jessica Rabbit</Link>
              <Link to='/user/bettyboop'>Betty Boop</Link>
            </header>
          </div>
          <div>Create a Team Page
          </div>
        </Route>

        {/* USER DASHBOARD */}
        <Route path='/user/:username'>
          <div className='App'>
            <header className='App-header'>
              <Link to='/'>Home</Link>
              <Link to='/user/elmerfudd'>Elmer Fudd</Link>
              <Link to='/user/jessicarabbit'>Jessica Rabbit</Link>
              <Link to='/user/bettyboop'>Betty Boop</Link>
            </header>
          </div>
          <MemberDashboard users={fakeUsers} />
        </Route>

        <Route path='/report'>
          <div>Mark my Goal Completion</div>
        </Route>
        <Route path='/'>
          <div className='home-header flex-sa'>
            <Link to='/create-team' className='home-button'>Create a Team</Link>
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
                        <MemberSummary team={team} displayHeight='vh65' />
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
