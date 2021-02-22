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

export function createTeam (token, team) {
  return API.post('teams/', team, {
    headers: {
      Authorization: `Token ${token}`
    }
  })
    .then(response => response.data)
}

export function getTeams (token) {
  return API
    .get('teams/', {
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

export function getMemberChores (token, username) {
  return API
    .get(`users/${username}/chores`, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
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

export function unsplashApi (query) {
  return axios.get(`https://api.unsplash.com/search/photos/?client_id=${process.env.REACT_APP_UNSPLASH_KEY}&query=${query}&orientation=landscape`)
    .then(res => res.data)
}

export function getMusicSamples (query) {
  return axios.get(`https://itunes.apple.com/search?media=music&term=${encodeURI(query)}`)
    .then(res => res.data)
}
