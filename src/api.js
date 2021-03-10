import axios from 'axios'

const API = axios.create({
  baseURL: 'https://team-jlt-backend.herokuapp.com/api/'
})

export function login (username, password) {
  return API
    .post('auth/token/login/', {
      username: username,
      password: password
    })
    .then(result => result.data)
    .catch(error => {
      console.log({ error })
      if (error.response) {
        if (error.response.data.non_field_errors) {
          throw new Error(error.response.data.non_field_errors.join(' '))
        }
      }
      throw new Error('Something went wrong.')
    })
}

export function register (username, password) {
  return API
    .post('auth/users/', {
      username: username,
      password: password
    })
    .then(result => {
      return login(username, password)
    })
    .catch(error => {
      let errors = []
      if (error.response) {
        const data = error.response.data
        if (data.username) {
          errors = errors.concat(data.username)
        }
        if (data.password) {
          errors = errors.concat(data.password)
        }
      }

      if (errors.length === 0) {
        errors.push('There was a problem registering.')
      }
      const err = new Error(errors[0])
      throw err
    })
}

export function createUser (username, password) {
  return API
    .post('auth/users/', {
      username: username,
      password: password
    })
    .then(response => response.data)
    .catch(error => {
      let errors = []
      if (error.response) {
        const data = error.response.data
        if (data.username) {
          errors = errors.concat(data.username)
        }
        if (data.password) {
          errors = errors.concat(data.password)
        }
      }

      if (errors.length === 0) {
        errors.push('There was a problem registering.')
      }
      const err = new Error(errors[0])
      throw err
    })
}

export function createTeam (token, teamName, teamSlogan, themeSong, backgroundImage, dashboardStyle) {
  return API
    .post('team-list/', {
      name: teamName,
      slogan: teamSlogan,
      theme_song: themeSong,
      background_image: backgroundImage,
      dashboard_style: dashboardStyle
    },
    {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(response => response.data)
}

export function addMember (token, username, teamPk) {
  return API
    .post(`team/${teamPk}/`, {
      username: username
    },
    {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(response => response.data)
}

export function getTeams (token, podPk) {
  return API
    .get(`pod-detail/${podPk}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getPods (token) {
  return API
    .get('pods/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
    // .then(data => data[0])
}

export function updatePod (token, teamName, podPk) {
  return API
    .post(`/pod-list/${podPk}/`, {
      name: teamName
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getTeam (token, teamPk) {
  return API
    .get(`team-detail/${teamPk}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

// export function getTeam (token, teamPk) {
//   return API
//     .get(`team/${teamPk}`, {
//       headers: {
//         Authorization: `Token ${token}`
//       }
//     })
//     .then(res => res.data)
// }

export function getMyProfile (token) {
  return API
    .get('my-profile/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}
export function getUserProfile (token, username) {
  return API
    .get(`user/${username}/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function updateUserProfile (token, username, avatar) {
  return API
    .patch(`/user/${username}/`, {
      avatar: avatar
    },
    {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(response => response.data)
}

export function getChores (token) {
  return API
    .get('chore-list/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function deleteChore (token, chorePk) {
  return API
    .delete(`chore-detail/${chorePk}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}
export function getMemberChores (token, username) {
  return API
    .get(`users/${username}/assignments`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function createChore (token, choreName, choreDetail, chorePoints, teamName) {
  return API
    .post('chore-list/', {
      name: choreName,
      detail: choreDetail,
      points: chorePoints,
      team: teamName
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
}

export function getChore (token, chorePk) {
  return API
    .get(`user-chore/${chorePk}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getRecords (token) {
  return API
    .get('records/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
    // .then(res => console.log(res.data))
}
export function unsplashApi (query, pageNumber) {
  return axios.get(`https://api.unsplash.com/search/photos?&page=${pageNumber}&orientation=landscape&client_id=${process.env.REACT_APP_UNSPLASH_KEY}&query=${query}`)
    .then(res => res.data.results)
}

export function getMusicSamples (query) {
  return axios.get(`https://itunes.apple.com/search?media=music&term=${encodeURI(query)}`)
    .then(res => res.data.results)
}

export function updateAssignment (token, assignPk, status, profileUsername, day) {
  return API
    .patch(`assignment-detail/${assignPk}/`, {
      complete: status,
      user: profileUsername,
      assignment_type: day
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    }
    )
    .then(res => res.data)
}

export function deleteAssignment (token, assignPk) {
  return API
    .delete(`assignment-detail/${assignPk}/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    }
    )
    .then(res => res.data)
}

export function postAssigment (token, chore, username, assignmentType) {
  return API
    .post('assignment-list/', {
      user: username,
      chore: parseInt(chore),
      assignment_type: assignmentType,
      comment: 'a'

    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getAssignments (token) {
  return API
    .get('assignment-list/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getPoints (token, username) {
  return API
    .get(`point-count/${username}/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getPointsByDay (token, username, day) {
  return API
    .get(`point-count/${day}/${username}/`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function postMessage (token, feedPk, sender, message, day) {
  return API
    .post('notifications/', {
      feed: feedPk,
      sender: sender,
      message: message,
      notification_type: day
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function postNotification (token, feedPk, target, message) {
  return API
    .post('notifications/', {
      feed: feedPk,
      target: target,
      message: message
    }, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getFeed (token, feedPk) {
  return API
    .get(`feed-detail/${feedPk}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getFeeds (token) {
  return API
    .get('feeds/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export function getStatusUpdate (token) {
  return API
    .get('activity/feed/14/json/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}
