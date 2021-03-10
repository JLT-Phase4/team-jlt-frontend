import Carousel from 'react-bootstrap/Carousel'
import { Link } from 'react-router-dom'
import ManageChoresView from './../images/ManageChoresView.jpg'
import CreateTeamView from './../images/CreateTeamView.jpg'
import AssignChoresView from './../images/AssignChoresView.jpg'
import ProfileLevelView from './../images/ProfileLevelView.jpg'
import PodLevelView from './../images/PodLevelView.jpg'
import TeamLevelView from './../images/TeamLevelView.jpg'
import walkingDogImage from './../images/walking-dog.png'

function AltHomepage () {
  return (
    <div className='althome-page-container'>
      <div>
        <div className='flex'>
          <h1 className='welcome-header'>Welcome to Chore Wars!</h1>
          <div className='header-bar' style={{ marginTop: '0', width: '170px', height: '170px', background: 'cover', backgroundImage: `url(${walkingDogImage})` }} />
        </div>
        <div>
          <p><Link to='/login'>Click here to log in.</Link></p>
        </div>
      </div>
      <div className='flex-row center'>
        {/* <div className=''> <div className='header-bar' style={{ backgroundImage: `url(${walkingDogImage})` }} />
        </div> */}
        <div className='homepage-carousel'>
          <Carousel>
            <Carousel.Item className='carousel-holder'>
              <a href={PodLevelView}><img className='welcome-page-card' src={PodLevelView} /></a>
            </Carousel.Item>
            <Carousel.Item className='carousel-holder'>
              <a href={CreateTeamView}><img className='welcome-page-card' src={CreateTeamView} /></a>
            </Carousel.Item>
            <Carousel.Item className='carousel-holder'>
              <a href={ManageChoresView}><img className='welcome-page-card' src={ManageChoresView} /></a>
            </Carousel.Item>
            <Carousel.Item className='carousel-holder'>
              <a href={AssignChoresView}><img className='welcome-page-card' src={AssignChoresView} /></a>
            </Carousel.Item>
            <Carousel.Item className='carousel-holder'>
              <a href={ProfileLevelView}><img className='welcome-page-card' src={ProfileLevelView} /></a>
            </Carousel.Item>
            <Carousel.Item className='carousel-holder'>
              <a href={TeamLevelView}><img className='welcome-page-card' src={TeamLevelView} /></a>
            </Carousel.Item>
          </Carousel>
        </div>
        {/* <div className='flex'>
        <a href={PodLevelView}><img className='welcome-page-card' src={PodLevelView} /></a>
        <a href={CreateTeamView}><img className='welcome-page-card' src={CreateTeamView} /></a>
        <a href={ManageChoresView}><img className='welcome-page-card' src={ManageChoresView} /></a>
        <a href={AssignChoresView}><img className='welcome-page-card' src={AssignChoresView} /></a>
        <a href={ProfileLevelView}><img className='welcome-page-card' src={ProfileLevelView} /></a>
        <a href={TeamLevelView}><img className='welcome-page-card' src={TeamLevelView} /></a>
      </div> */}
      </div>
    </div>
  )
}
export default AltHomepage
