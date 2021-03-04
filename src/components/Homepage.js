import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import HomeCarouselTeams from './HomeCarouselTeams'
import HomePageScoreCards from './HomePageScoreCards'
import CreateTeamDashboard from './CreateTeamDashboard'
import Feed from './Feed'

const Homepage = ({ token, teams, myPod, profileUsername, isCaptain, isCreatingTeam, setIsCreatingTeam, feedPk, today }) => {
  return (
    <div>
      {token && teams && myPod && (
        <div>
          <div className='App' />

          <div>
            <Carousel>
              {teams.map((team, idx) => (
                <Carousel.Item key={idx} className='carousel-holder'>
                  {team && (
                    <div className='flex-col'>
                      <Card>
                        <Card.Body>
                          <HomeCarouselTeams team={team} displayHeight='50vh' />
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
            <HomePageScoreCards teams={teams} isCaptain={isCaptain} profileUsername={profileUsername} />

            <div style={{ border: '3px solid crimson', width: '100%' }} className='team-feed-container'>
              <Feed token={token} profileUsername={profileUsername} feedPk={feedPk} today={today} className='footer-feed'>Latest Notification Feed</Feed>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage
