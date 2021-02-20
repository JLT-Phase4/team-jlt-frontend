import axios from 'axios'

const API = axios.create({
  baseURL: 'https://team-jlt-backend.herokuapp.com/api/'
})

export function getTeams (token) {
  return API
    .get('teams/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => res.data)
}

export default getTeams
