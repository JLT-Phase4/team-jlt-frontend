import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import { Spring } from 'react-spring/renderprops'

const outerDivStyle = {
  width: '80px',
  height: '105px',
  background: 'linear-gradient(#3a93eb, #052075)'
}

const HomeScoreCards = ({ teams }) => {
  return (
    <>
      {teams.map((team, idx) => (
        <div key={idx}>
          {(team) && (
            <Link to={`/team/${team.teamPk}`} className='flex-col'>
              <Card>
                <Card.Body>
                  <div className='home-scorecard'>{team.name}
                    <div style={outerDivStyle}>
                      <Spring
                        reset
                        config={{ duration: 3000 }}
                        from={{ height: '105px', width: '80px', backgroundColor: '#0e0e0e' }}
                        to={{ height: `${105 - team.score * 100}px`, width: '80px', backgroundColor: '#0e0e0e' }}
                      >
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
    </>
  )
}

export default HomeScoreCards
