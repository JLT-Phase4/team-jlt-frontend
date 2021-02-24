import { useState, useRef } from 'react'

const data = [
  { assignment_type: 'MON', chores: ['groom mustache', 'call girlfriend', 'be stoic'] },
  { assignment_type: 'TUE', chores: ['create skynet', 'encourage Jesse'] },
  { assignment_type: 'WED', chores: ['create skynet', 'encourage Jesse'] },
  { assignment_type: 'THUR', chores: ['reinvent wheel', 'brush teeth'] },
  { assignment_type: 'FRI', chores: ['end skynet'] },
  { assignment_type: 'SAT', chores: ['wash car'] },
  { assignment_type: 'SUN', chores: ['make dollars'] }
]
const names = ['Logan', 'Tracy', 'Jesse']

function ChoreAssignment () {
  const [list, setList] = useState(data)
  const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dragBox = useRef()

  // item we are dragging(from)DRAG
  const handleDragStart = (event, parameters) => {
    // console.log(parameters)
    dragItem.current = parameters
    dragBox.current = event.target
    dragBox.current.addEventListener('dragend', handleDragEnd)
    setTimeout(() => {
      setDragging(true)
    }, 0)
  }

  //   this is the item we are dragging over, DROP
  const handleDragEnter = (event, parameters) => {
    const currentItem = dragItem.current
    if (event.target !== dragBox.current) // if target is not the same as node item started in
    {
      setList(oldList => {
        const newList = JSON.parse(JSON.stringify(oldList)) // original list needs to change to new list.  Break apart items in old list.  Replace item with current item.
        newList[parameters.itemI].items.splice(parameters.choreI, 0, newList[currentItem.itemI].items.splice(currentItem.choreI, 1)[0]) // flip places of cards.  so convuluted.  Ah!
        dragItem.current = parameters // now current item has become target item
        return newList
      })
    }
  }

  const handleDragEnd = () => {
    // console.log('its working!')
    setDragging(false)
    dragBox.current.removeEventListener('dragend', handleDragEnd)
    dragItem.current = null
    dragBox.current = null
  }

  const getStyles = (parameters) => {
    const currentItem = dragItem.current
    if (currentItem.itemI === parameters.itemI && currentItem.choreI === parameters.choreI) {
      return 'current drag-and-drop-chore'
    }
    return 'drag-and-drop-chore'
  }

  return (
    <div>
      {/* <div> */}
      {/* {names.map((name) => (
          <div key={name} className='team-member-container'>
            <div className='team-member'>{name}</div> */}

      <div className='drag-and-drop-container'>
        {list.map((item, itemI) => (
          <div
            key={item.assignment_type}
            className='day-container'
          >
            <div className='days'>{item.assignment_type}</div>
            {item.chores.map((chore, choreI) => (
              <div
                draggable
                onDragStart={(event) => { handleDragStart(event, { itemI, choreI }) }}
                onDragEnter={dragging ? (event) => { handleDragEnter(event, { itemI, choreI }) } : null}
                key={chore}
                className={dragging ? getStyles({ itemI, choreI }) : 'drag-and-drop-chore'}
              >
                {chore}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* </div> */}
      {/* ))}
      </div> */}
    </div>
  )
}

export default ChoreAssignment
