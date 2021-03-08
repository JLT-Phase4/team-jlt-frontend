import washingDishesImage from './../images/washing-dishes.png'
import Carousel from 'react-bootstrap/Carousel'
import { Link } from 'react-router-dom'

const About = (props) => {
  return (
    <div style={{ marginTop: '30px' }} className='flex-col login-page-container'>
      <h2>About Us</h2>
      <div className='flex-col-center'>
        <div className='header-bar' style={{ backgroundImage: `url(${washingDishesImage})` }} />
        {/* <img className='logo-image' width='200' height='200' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqBhhVt6J7_Um29hkn98B85xfFHkDnT5TB2w&usqp=CAU' alt='' /> */}
        <div style={{ width: '80%' }} className='welcome-text1'>
          <p>
            <span>Chore Wars is a free app that helps your family </span>
            <span>achieve individual goals by gamifying everyday tasks. </span>
            <span>Create a team to assign chores </span>
            <span> to members of your household. </span>
            <span> Track individual and team progress </span>
            <span>and compare with other teams. </span>
            <span>It's easy to use, and a whole lot of fun. Register here to get started!</span>
          </p>
          <p>
            <span>Sign up <Link to='/register'>here</Link> to get chores done while having fun! </span>
            <span>Compete against family members, </span>
            <span>neighboring households and friends </span>
            <span>to find out who will be the next Chore Wars champion.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
export default About
