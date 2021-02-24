import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getMyProfile, getUserProfile, updateUserProfile } from '../api'
import AvatarImage from './AvatarImage'

// Won't pass username once this has avatar on myprofile
const UserProfile = ({ token, profileUsername }) => {
  const { username } = useParams()
  const [userProfile, setUserProfile] = useState()
  // const [myProfile, setMyProfile] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  // const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDQxMTN8MHwxfHNlYXJjaHw2fHxkb2d8ZW58MHx8fA&ixlib=rb-1.2.1&q=80&w=1080')
  const [avatar, setAvatar] = useState('')

  useEffect(updateProfile, [token, username, isUpdating])

  function updateProfile () {
    getUserProfile(token, username).then(profile => {
      setUserProfile(profile)
    })
    // getMyProfile(token).then(myProfile => setMyProfile(myProfile))
  }

  function updateAvatar () {
    updateUserProfile(token, username, avatar).then(profile => setUserProfile(profile))
    setIsUpdating(false)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {userProfile && (
        <div style={{ minWidth: '90%' }} className=' member-dashboard-container'>
          <div className='team-title'>{userProfile.username} page!</div>

          {(!isUpdating)
            ? <div style={{ minWidth: '90%' }}>
              <div className='flex-sa'>
                {/* <div className='team-title'>{userProfile.username} page!</div> */}
                <div>
                  <div>Is on team NAME TEAM</div>

                  <div className='avatar-image' style={{ backgroundImage: `url(${userProfile.avatar})` }} />
                </div>
                <div className='flex-col'>
                  <div style={{ minWidth: '50%', border: 'solid 2px', borderRadius: '10px', margin: '10px' }}>Completed
                    <div className='flex'>
                      <Card>
                        <Card.Body>brush teeth</Card.Body>
                      </Card>
                    </div>
                  </div>
                  <div style={{ minWidth: '50%', border: 'solid 2px', borderRadius: '10px', margin: '10px' }}>Chores for Today
                    <div className='flex'>
                      <Card>
                        <Card.Body>laundry</Card.Body>
                      </Card>
                      <Card>
                        <Card.Body>dishes</Card.Body>
                      </Card>
                      <Card>
                        <Card.Body>mow lawn</Card.Body>
                      </Card>
                    </div>
                  </div>
                  <div style={{ minWidth: '50%', border: 'solid 2px', borderRadius: '10px', margin: '10px' }}>Chores for This Week
                    <div className='flex'>
                      <Card>
                        <Card.Body>laundry<span>W, F</span></Card.Body>
                      </Card>
                      <Card>
                        <Card.Body>wash car</Card.Body>
                      </Card>
                      <Card>
                        <Card.Body>walk dog</Card.Body>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
              {/* {myProfile.assignments.map((chore, idx) => (
                <Link key={idx} className='chore-detail' to={`/member/${username}/chores/`}>{chore}</Link>
              ))} */}
              {(profileUsername === username) &&
                <button onClick={() => setIsUpdating(true)} className='home-dash-button'>Update Profile</button>}
            </div>
            : <div style={{ minHeight: '60vh', justifyContent: 'center', alignItems: 'center' }} className='flex-col'>
              {/* <div className='team-title'>{userProfile.username} page!</div> */}
              <div>Is on team NAME TEAM</div>

              <div className='avatar-image' style={{ backgroundImage: `url(${avatar})` }} />
              <AvatarImage token={token} setAvatar={setAvatar} />
              <button onClick={() => updateAvatar()} className='home-dash-button'>Done Updating</button>
            </div>}

        </div>
      )}
    </div>
  )
}

export default UserProfile
