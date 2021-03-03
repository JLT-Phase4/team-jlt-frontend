import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import HomeCarouselTeams from './HomeCarouselTeams'
import HomePageScoreCards from './HomePageScoreCards'
import CreateTeamDashboard from './CreateTeamDashboard'

const Homepage = ({ token, teams, myPod, profileUsername, isCaptain, isCreatingTeam, setIsCreatingTeam }) => {
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

            <div className='footer-feed'>Latest Notification Feed</div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage
