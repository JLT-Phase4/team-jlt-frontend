
const fakeTeamMembers = [
  { username: 'Logan', assignment_type: ['MD', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'] },
  { username: 'Tracy', assignment_type: ['MD', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'] }
]

const fakeChores = [
  { chore: ['groom_mustache', 'call_girlfriend', 'be_stoic', 'create_skynet', 'encourage_Jesse'] }
]

function ChoreAssignment () {
  return (
    <div className='page-container'>
      <div className='drag-and-drop-container'>
        {fakeTeamMembers.map((name, nameI) => (
          <div key={name.username} className='team-member-container'>
            <div className='team-member'>{name.username}</div>
            {name.assignment_type.map((day, dayI) => (
              <div draggable key={day} className='drag-and-drop-chore'>
                {day}
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  )
}

export default ChoreAssignment
