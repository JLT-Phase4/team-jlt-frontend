import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import { Spring } from 'react-spring/renderprops'

const outerDivStyle = {
  width: '80px',
  height: '105px',
  background: 'linear-gradient(#3a93eb, #052075)'
}

const HomePageScoreCards = ({ teams }) => {
  return (
    <div className='home-header flex-sa'>
      {teams.map((team, idx) => (
        <div key={idx}>
          {(team) && (
            <Link to={`/team/${team.pk}`} className='flex-col'>
              <Card>
                <Card.Body style={{ backgroundColor: `${team.dashboard_style}` }} className='dashboard-style'>
                  <div className='home-scorecard'>{team.name}
                    <div style={outerDivStyle}>
                      <Spring
                        reset
                        config={{ duration: 3000 }}
                        from={{ height: '105px', width: '80px', backgroundColor: '#0e0e0e' }}
                        to={{ height: `${105 - 0.7 * 100}px`, width: '80px', backgroundColor: '#0e0e0e' }}
                      >
                        {/* height in the 'to' will ultimately be dynamic with 0.7 set as team percentage */}
                        {props => (
                          <div style={props} />
                        )}
                      </Spring>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}

export default HomePageScoreCards
