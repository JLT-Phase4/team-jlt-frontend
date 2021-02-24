import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyProfile, getUserProfile, updateUserProfile } from './../api'
import AvatarImage from './AvatarImage'

// Won't pass profileUsername once this has avatar on myprofile
const MyProfile = ({ token, profileUsername }) => {
  const [userProfile, setUserProfile] = useState()
  // const [myProfile, setMyProfile] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  // const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDQxMTN8MHwxfHNlYXJjaHw2fHxkb2d8ZW58MHx8fA&ixlib=rb-1.2.1&q=80&w=1080')
  const [avatar, setAvatar] = useState('')

  useEffect(updateProfile, [token, profileUsername, isUpdating])

  function updateProfile () {
    getUserProfile(token, profileUsername).then(profile => {
      setUserProfile(profile)
    })
    // getMyProfile(token).then(myProfile => setMyProfile(myProfile))
  }

  function updateAvatar () {
    updateUserProfile(token, profileUsername, avatar).then(profile => setUserProfile(profile))
    setIsUpdating(false)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {userProfile && (
        <div className='member-dashboard-container'>

          {(!isUpdating)
            ? <div className='member-dashboard-container'>
              <div className='team-title'>{userProfile.username} page!</div>
              {/* <div>Is on team {myProfile.teams[0]}</div> */}

              <div className='avatar-image' style={{ backgroundImage: `url(${userProfile.avatar})` }} />
              {/* {myProfile.assignments.map((chore, idx) => (
                <Link key={idx} className='chore-detail' to={`/member/${profileUsername}/chores/`}>{chore}</Link>
              ))} */}
              <button onClick={() => setIsUpdating(true)} className='home-dash-button'>Update Profile</button>
              </div>
            : <div className='member-dashboard-container'>
              <div className='team-title'>{userProfile.username} page!</div>
              {/* <div>Is on team {myProfile.teams[0]}</div> */}

              <div className='avatar-image' style={{ backgroundImage: `url(${avatar})` }} />
              <div>Some stuff to do...</div>
              <AvatarImage token={token} setAvatar={setAvatar} />
              <button onClick={() => updateAvatar()} className='home-dash-button'>Done Updating</button>
              </div>}

        </div>
      )}
    </div>
  )
}

export default MyProfile
