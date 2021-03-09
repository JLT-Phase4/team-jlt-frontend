import Carousel from 'react-bootstrap/Carousel'
import HomeCarouselTeams from './HomeCarouselTeams'
import HomePageScoreCards from './HomePageScoreCards'
import FeedCombo from './FeedCombo'
import { Redirect } from 'react-router-dom'

const Homepage = ({ token, myTeam, teams, myPod, profileUsername, isCaptain, isCreatingTeam, setIsCreatingTeam, feedPk, today }) => {
  if (!token) {
    return <Redirect to='/login' />
  }

  return (
    <div>
      {token && teams && myPod && feedPk && (
        <div>
          <div className='flex-nowrap home-page-container'>
            <div className='flex-col' style={{ width: '1000px' }}>
              <Carousel>
                {teams.map((team, idx) => (
                  <Carousel.Item key={idx} className='carousel-holder'>
                    {team && (
                      <HomeCarouselTeams team={team} displayHeight='38vh' />
                    )}
                  </Carousel.Item>
                ))}
              </Carousel>
              <HomePageScoreCards token={token} today={today} myTeam={myTeam} teams={teams} isCaptain={isCaptain} profileUsername={profileUsername} />
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
