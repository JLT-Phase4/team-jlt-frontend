import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import HomeCarouselTeams from './HomeCarouselTeams'
import HomePageScoreCards from './HomePageScoreCards'
import CreateTeamDashboard from './CreateTeamDashboard'
import FeedCombo from './FeedCombo'
import { Redirect } from 'react-router-dom'

const Homepage = ({ token, teams, myPod, profileUsername, isCaptain, isCreatingTeam, setIsCreatingTeam, feedPk, today, isRedirecting }) => {
  if (isRedirecting) {
    setTimeout(function () {
      if (!token) {
        return <Redirect to='/login' />
      }
    }, 1000)
  }

  return (
    <div>
      {token && teams && myPod && feedPk && (
        <div>
          <div className='flex-nowrap home-page-container'>
            <div className='flex-col' style={{ width: '800px' }}>
              <Carousel>
                {teams.map((team, idx) => (
                  <Carousel.Item key={idx} className='carousel-holder'>
                    {team && (
                      <HomeCarouselTeams team={team} displayHeight='40vh' />
                    )}
                  </Carousel.Item>
                ))}
              </Carousel>
              <HomePageScoreCards token={token} teams={teams} isCaptain={isCaptain} profileUsername={profileUsername} />
            </div>
            <div className='team-feed-container'>
              <FeedCombo teams={teams} token={token} profileUsername={profileUsername} feedPk={feedPk} today={today} className='footer-feed'>Latest Notification Feed</FeedCombo>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage
