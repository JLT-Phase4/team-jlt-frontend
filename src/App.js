
import './App.css'
// import createPersistedState from 'use-persisted-state'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
// import { LinkContainer } from 'react-router-bootstrap'
// import { useEffect, useState } from 'react'

// const useUsername = createPersistedState('team_username')
// const useToken = createPersistedState('team_token')

function App () {
  // const [username, setUsername] = useUsername()
  // const [token, setToken] = useToken()

  // function setAuth (username, token) {
  //   setUsername(username)
  //   setToken(token)
  // }

  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Link to='/'>Home</Link>
          <Link to='/create-team'>Create a Team</Link>
          <Link to='/teams'>List Teams</Link>
          <Link to='/my-profile'>Member Profile</Link>
        </header>
      </div>
      <Switch>
        <Route path='/teams'>
          <div>Team List Page</div>
        </Route>
        <Route path='/create-team'>
          <div>Create a Team Page
          </div>
        </Route>
        <Route path='/my-profile'>
          <div>My Profile Page</div>
        </Route>
        <Route path='/'>
          <div>Home Page</div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
