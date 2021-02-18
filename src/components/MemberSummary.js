const MemberSummary = ({ team, displayHeight }) => {
  return (
    <>
      {team && (

        <div style={{ height: `${displayHeight}`, backgroundImage: `url(${team.logoUrl})` }} className='dashboard-container'>
          <div className='team-title'>We are team {team.name}!</div>
          <div className='team-scoreblock'>
            {team.users.map(user => (
              <div key={user.username}>Member: {user.username} Score: {user.score} </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MemberSummary
