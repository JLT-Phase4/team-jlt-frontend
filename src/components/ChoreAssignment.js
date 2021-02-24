import { useState } from 'react'

const data = [
  { assignment_type: 'MON', chores: ['groom_mustache', 'call_girlfriend', 'be_stoic'] },
  { assignment_type: 'TUE', chores: ['create_skynet', 'encourage_Jesse'] },
  { assignment_type: 'WED', chores: ['create_skynet', 'encourage_Jesse'] },
  { assignment_type: 'THUR', chores: ['reinvent wheel', 'brush_teeth'] },
  { assignment_type: 'FRI', chores: ['end_skynet'] },
  { assignment_type: 'SAT', chores: ['wash_car'] },
  { assignment_type: 'SUN', chores: ['make_dollars'] }
]
const names = ['Logan', 'Tracy', 'Jesse']

function ChoreAssignment () {
  return (
    <div>
      <div>
        {names.map((name) => (
          <div key={name} className='team-member-container'>
            <div className='team-member'>{name}</div>

            <div className='drag-and-drop-container'>
              {data.map((item, itemI) => (
                <div key={item.assignment_type} className='day-container'>
                  <div className='days'>{item.assignment_type}</div>
                  {item.chores.map((chore, choreI) => (
                    <div draggable key={chore} className='drag-and-drop-chore'>
                      {chore}
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default ChoreAssignment
