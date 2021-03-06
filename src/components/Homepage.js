import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import HomeCarouselTeams from './HomeCarouselTeams'
import HomePageScoreCards from './HomePageScoreCards'
import CreateTeamDashboard from './CreateTeamDashboard'
import Feed from './Feed'
import FeedTest from './FeedTest'
import StatusUpdate from './StatusUpdate'

const Homepage = ({ token, teams, myPod, profileUsername, isCaptain, isCreatingTeam, setIsCreatingTeam, feedPk, today }) => {
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

                      <HomeCarouselTeams team={team} displayHeight='50vh' />

                    )}
                  </Carousel.Item>
                ))}
              </Carousel>
              <HomePageScoreCards teams={teams} isCaptain={isCaptain} profileUsername={profileUsername} />
            </div>
            {/* <div className='flex-col' style={{ alignItems: 'center' }}> */}
            <div className='team-feed-container'>
              {/* <Feed token={token} profileUsername={profileUsername} feedPk={feedPk} today={today} className='footer-feed'>Latest Notification Feed</Feed> */}
              <StatusUpdate token={token} profileUsername={profileUsername} feedPk={feedPk} today={today} className='footer-feed'>Latest Notification Feed</StatusUpdate>

            </div>
            {/* </div> */}

          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage
