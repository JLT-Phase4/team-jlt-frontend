const TeamFeed = ({ team }) => {
  return (
    <>
      {team && (

        <div className='team-feed-container'>
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
