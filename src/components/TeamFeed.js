const TeamFeed = ({ team }) => {
  return (
    <>
      {team && (
        <div style={{ border: `3px solid ${team.dashboard_style}`, backgroundColor: `${team.dashboard_style}` }} className='team-feed-container'>
          <h1>Feed will go here:</h1>
          <ul>
            <li>notifications</li>
            <li>comments</li>
            <li>emojis?</li>
          </ul>
        </div>
      )}
    </>
  )
}

export default TeamFeed
