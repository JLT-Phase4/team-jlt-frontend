import Carousel from 'react-bootstrap/Carousel'
import { Link } from 'react-router-dom'
import ManageChoresView from './../images/ManageChoresView.jpg'
import CreateTeamView from './../images/CreateTeamView.jpg'
import AssignChoresView from './../images/AssignChoresView.jpg'
import ProfileLevelView from './../images/ProfileLevelView.jpg'
import PodLevelView from './../images/PodLevelView.jpg'
import TeamLevelView from './../images/TeamLevelView.jpg'
import washingDishesImage from './../images/washing-dishes.png'

function AltHomepage () {
  return (
    <div style={{ marginLeft: '50px' }} className='flex-col'>
      <div className=''> <div className='header-bar' style={{ backgroundImage: `url(${washingDishesImage})` }} />
      </div>
      <div>
        <p className='route-to-reg'>Already a Chore Wars member? <Link to='/login'>Click here to log in.</Link></p>
      </div>
      {/* <Carousel> <Carousel.Item className='carousel-holder'> <div>Here is Carousel</div> </Carousel.Item> </Carousel> */}
      <div className='flex'>
        <a href={PodLevelView}><img className='welcome-page-card' src={PodLevelView} /></a>
        <a href={CreateTeamView}><img className='welcome-page-card' src={CreateTeamView} /></a>
        <a href={ManageChoresView}><img className='welcome-page-card' src={ManageChoresView} /></a>
        <a href={AssignChoresView}><img className='welcome-page-card' src={AssignChoresView} /></a>
        <a href={ProfileLevelView}><img className='welcome-page-card' src={ProfileLevelView} /></a>
        <a href={TeamLevelView}><img className='welcome-page-card' src={TeamLevelView} /></a>
      </div>
    </div>
  )
}
export default AltHomepage
