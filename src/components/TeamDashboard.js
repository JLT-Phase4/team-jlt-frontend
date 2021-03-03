import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTeam, postNotification, getFeed } from './../api'
import PodFeed from './PodFeed'
import ScoreBoard from './ScoreBoard'

const TeamDashboard = ({ token, profileUsername, today, myPod, myFeedPk }) => {
  const { teamPk } = useParams()
  const [team, setTeam] = useState()
  const [notPosted, setNotPosted] = useState(false)
  const [feed, setFeed] = useState()
  // const [feedPk, setFeedPk] = useState()

  useEffect(updateTeam, [token, teamPk, today, profileUsername, notPosted])

  function updateTeam () {
    getTeam(token, teamPk).then(team => setTeam(team))
  }

  // useEffect(renderFeeds, [token, feedPk, setFeedPk, myPod, notPosted])
  // function renderFeeds () {
  //   getFeeds(token)
  //     .then(feeds => {
  //       for (const feed of feeds) {
  //         // console.log(feed)
  //         if (feed.pod === myPod) {
  //           console.log('this is my feed', feed)
  //           setFeedPk(feed.pk)
  //           getFeed(token, feed.pk)
  //             .then(feed => setFeed(feed))
  //         }
  //       }
  //     })
  // }

  useEffect(renderFeed, [token, myFeedPk, myPod, notPosted])
  function renderFeed () {
    if (myFeedPk) {
      getFeed(token, myFeedPk)
        .then(feed => setFeed(feed))
    }
  }

  // const list = ['a', 'b', 'c']

  // for (const value of list) {
  //   console.log(value)
  //   if (value === 'b') {
  //     break
  //   }
  // }
  // if(prevState.data !== this.state.data)

  useEffect(updateNotifications, [token, today, notPosted])
  function updateNotifications () {
    if (team && notPosted && feed) {
      console.log('I am in update notifications')
      for (const member of team.members) {
        console.log(member.possible_chore_points.chore__points__sum, member.earned_chore_points.chore__points__sum)
        if (member.earned_chore_points.chore__points__sum / member.possible_chore_points.chore__points__sum > 0.5) {
          console.log(member.username + 'has more than than than 50%')
          createNotifications(feed.pk, member.username, 'you are above 30%')
        }
      }
    }
  }

  function createNotifications (myFeedPk, target, message) {
    postNotification(token, myFeedPk, target, message).then((response) => {
      updateTeam()
      setNotPosted(false)
    }
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {team &&
        (
          <>
            <div className='flex-center'>
              <div className='team-dashboard-container' style={{ backgroundImage: `url(${team.background_image}` }}>
                <div className='team-title'>{team.name}!</div>
                <div className='team-slogan'>{team.slogan}!
                </div>
                <audio controls src={team.theme_song} />
              </div>
              <div style={{ width: '100%', margin: '20px', justifyContent: 'space-between' }} className='flex'>
                <div style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: `${team.dashboard_style}` }} className='team-feed-container'>
                  {/* <h1>Feed will go here:</h1>
                  <ul>
                    <li>notifications</li>
                    <li>comments</li>
                    <li>emojis?</li>
                  </ul> */}
                  {feed && (
                    <PodFeed token={token} profileUsername={profileUsername} today={today} myPod={myPod} myFeedPk={myFeedPk} />
                  )}
                </div>
                <div className='team-dashboard-scoreboard-container' style={{ border: `3px solid ${team.dashboard_style}` }}>
                  <div style={{ justifyContent: 'center' }} className='team-scoreblock flex-col'>
                    {team.members.length > 0
                      ? (
                        <div>
                          {team.members.map(member => (
                            <ScoreBoard team={team} member={member} key={member.username} />
                          ))}
                        </div>
                        )
                      : <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'><Link to={`/create-team-members/${team.pk}/${team.name}`}>Add Team Members</Link></button>}
                  </div>
                </div>
                {/* <button style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'>Send Notifications</button> */}

                <button onClick={() => setNotPosted(true)} style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: team.dashboard_style }} className='team-dash-button'>Send Notifications</button>
              </div>
            </div>
          </>
        )}
    </div>
  )
}

export default TeamDashboard
