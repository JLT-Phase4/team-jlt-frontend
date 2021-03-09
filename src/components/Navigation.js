
import { Link } from 'react-router-dom'
import { MDBDropdownMenu, MDBDropdown, MDBDropdownItem, MDBDropdownToggle } from 'mdbreact'

const Navigation = ({ token, myTeam, isCaptain, username, handleTime, handleLogout, isLoggedIn }) => {
  return (
    <div className='chore-wars-nav'>
      <div style={{ justifyContent: 'space-between' }} className='flex chore-wars-bar'>
        <div className='flex'>
          <Link to='/' className='banner'>Chore Wars</Link>
        </div>
        {token && (
          <ul style={{ paddingTop: '10px' }} className='flex'>
            <li className=''><Link to='/'>Pod</Link></li>
            <li className=''><Link to={`/team/${myTeam}`}>Team</Link></li>
            {isCaptain === true &&
              <li className=''><Link to={`/chore-assignment/${myTeam}/`}>Assign Chores</Link></li>}
            {isCaptain === false &&
              <li className=''><Link to={`/user-profile/${username}`}>Profile</Link></li>}
            <li className=''><Link to={`/team-chores/${myTeam}`}>{isCaptain ? 'Manage Chores' : 'Chores'}</Link></li>
          </ul>
        )}

        <div className='flex-row' style={{ paddingTop: '10px' }}>
          <div className='about-link'><Link to='/about'>About</Link></div>
          {isLoggedIn
            ? (
              <span><div><span>Welcome, {username} <span className='logout' style={{ marginLeft: '10px' }} onClick={() => handleLogout()}> Logout</span></span></div></span>
          // <span><div className='nav-bar-link' onClick={() => setToken(null)}>Log out</div></span>
              )
            : (
              <span>
                <Link className='login-link' to='/login'>Login</Link>or<Link className='nav-bar-link' to='/register'>Register</Link>
              </span>
              )}
        </div>
        {token && (
          <div className='flex'>

            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <div className='d-none d-md-inline'>Day</div>
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
          </div>
        )}

      </div>
    </div>

  )
}

export default Navigation
