import { useState, useEffect, useRef } from 'react'
import { getChores, getTeam, postAssigment, getAssignments, getUserProfile } from './../api'
import { useParams, Link } from 'react-router-dom'

function ChoreList ({ token, teamPk, teamName, userProfiles, dragging, setDragging }) {
  const [chores, setChores] = useState([])
  // const [dragging, setDragging] = useState(false)
  const dragItem = useRef()
  const dropNode = useRef()
  // const [userProfiles, setUserProfiles] = useState([])

  useEffect(updateChores, [token, teamPk, userProfiles])
  function updateChores () {
    getChores(token).then(chores => {
      let newChores = []
      for (const chore of chores) {
        if (chore.team === teamName) {
          newChores = newChores.concat(chore)
        }
      }
      setChores(newChores)
    }
    )
  }

  function handleDragStart (event, { chore }) {
    console.log('drag is starting baby!', chore, chore.name, chore.pk)
    dragItem.current = chore // params // setting drag item to useRef which keeps will store items in variable we can keep around between rerenders.
    console.log('what type is chore', typeof (chore))
    dropNode.current = event.target
    dropNode.current.addEventListener('dragend', handleDragEnd)
    const choreTransfer = chore.name + '???' + chore.pk
    event.dataTransfer.setData('text/plain', choreTransfer)
    setDragging(true) // hey react! just letting u know we are dragging now
    window.scroll({
      top: 1000,
      left: 1000,
      behavior: 'smooth'
    })
  }

  function handleDragEnd () {
    console.log('drag ends when I release my mouse')
    setDragging(false)
    dropNode.current.removeEventListener('dragend', handleDragEnd)
    dragItem.current = null
    dropNode.current = null
  }

  return (
    <div>
      {userProfiles && chores && (
        <div>
          <div style={{ marginLeft: '20px', paddingLeft: '20px' }} className='chore-list-container flex-col'><span style={{ color: 'yellowgreen', fontSize: '25px' }}>Chores</span>
            <div className='flex'>
              {chores.map(chore => (
                <ul key={chore.pk}>
                  <li
                    draggable
                    onDragStart={(event) => { handleDragStart(event, { chore }) }}
                  >{chore.name}
                  </li>
                </ul>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default ChoreList
