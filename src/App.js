
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import TeamDashboard from './components/TeamDashboard'
import TeamChoreDashboard from './components/TeamChoreDashboard'
import Homepage from './components/Homepage'
import ChoreSummary from './components/ChoreSummary'
import CreateTeamDashboard from './components/CreateTeamDashboard'
import CreateTeamMembers from './components/CreateTeamMembers'
import UserProfile from './components/UserProfile'
import Navigation from './components/Navigation'
import { useEffect, useState } from 'react'
import { getTeams, getPods } from './api'
import createPersistedState from 'use-persisted-state'
import Login from './components/Login'
import Register from './components/Register'
import AltHomepage from './components/AltHomepage'
import About from './components/About'

const useUsername = createPersistedState('username')
const useToken = createPersistedState('token')

function App () {
  const [teams, setTeams] = useState([])
  const [token, setToken] = useToken()
  const [username, setUsername] = useUsername()
  const [isCaptain, setCaptain] = useState(false)
  const [today, setToday] = useState('MONDAY')
  const [todayIndex, setTodayIndex] = useState(0)
  const [myTeam, setMyTeam] = useState()
  const [team, setTeam] = useState()
  const [myPod, setMyPod] = useState()
  const [myPodFeedPk, setMyPodFeedPk] = useState()
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  // const [assignments, setAssignments] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [avatar, setAvatar] = useState('')
  const AVATAR = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5MDF8MHwxfHNlYXJjaHw5fHxyb2JvdHxlbnwwfDB8fA&ixlib=rb-1.2.1&q=80&w=1080'

  function setAuth (username, token) {
    setUsername(username)
    setToken(token)
  }
  const isLoggedIn = (username && token)

  function updateTeamScores (teams) {
    const teamsTotalPoints = []
    const teamsPossiblePoints = []
    const teamsPercentage = []
    for (const team of teams) {
      let teamTotalPoints = 0
      let teamPossiblePoints = 0
      for (const member of team.members) {
        teamTotalPoints += member.earned_chore_points.chore__points__sum
        teamPossiblePoints += member.possible_chore_points.chore__points__sum
      }
      team.teamTotalPoints = teamTotalPoints
      team.teamPossiblePoints = teamPossiblePoints
      team.teamPercentage = teamTotalPoints / teamPossiblePoints
      teamsPossiblePoints.push(team.teamPossiblePoints)
      teamsTotalPoints.push(team.teamTotalPoints)
      teamsPercentage.push(team.teamPercentage)
    }
    teams.teamTotalPoints = teamsTotalPoints
    teams.teamsPossiblePoints = teamsPossiblePoints
    teams.teamsPercentage = teamsPercentage
  }
  // react context
  useEffect(updatePod, [token, username, setTeam, setCaptain, setMyPod, setMyPodFeedPk, setIsLoading])

  function updatePod () {
    getPods(token)
      .then(pods => {
        for (const pod of pods) {
          if (pod.teams) {
            for (const team of pod.teams) {
              if (username === team.captain) {
                setMyPod(pod.pk)
                setCaptain(true)
                if (pod.feed[0]) {
                  setMyPodFeedPk(pod.feed[0].pk)
                }
                setMyTeam(team.pk)
                setTeam(team)
              }
              for (const member of team.members) {
                if (username === member.username) {
                  setMyPod(pod.pk)
                  if (pod.feed[0]) {
                    setMyPodFeedPk(pod.feed[0].pk)
                  }
                  setMyTeam(team.pk)
                  setTeam(team)
                }
              }
              if (!myTeam) {
                setIsLoading(false)
              }
            }
          }
        }
      })
  }

  useEffect(updateTeams, [token, username, myPod, setTeams])

  // useEffect(updateTeams, [token, username, isCreatingTeam, setIsCreatingTeam, myPod, setMyPod, setMyTeam, setTeams, setTeam, myPodFeedPk, setMyPodFeedPk, setIsLoading])
  function updateTeams () {
    if (myPod) {
      getTeams(token, myPod).then(pod => {
        // console.log(pod.teams)
        updateTeamScores(pod.teams)
        setTeams(pod.teams)
      }
      )
    }
  }

  useEffect(getAvatar, [team, setAvatar, avatar])
  function getAvatar () {
    if (team) {
      for (const member of team.members) {
        if (username) {
          if (username === member.username) {
            // setAvatar(member.avatar)
            if (member.avatar !== null && member.avatar !== undefined && member.avatar !== '') {
              setAvatar(member.avatar)
            } else {
              setAvatar(AVATAR)
            }
          }
        }
      }
      // sets all captains to default av.  Change later.
      if (username === team.captain) {
        setAvatar(AVATAR)
      }
    }
  }

  // KEEP THIS HERE IF WE NEED IT TO QUICKLY RESET LATER
  // const dayDict = [{ day: 'MONDAY', index: 0 }, { day: 'TUESDAY', index: 1 }, { day: 'WEDNESDAY', index: 2 },
  //   { day: 'THURSDAY', index: 3 }, { day: 'FRIDAY', index: 4 }, { day: 'SATURDAY', index: 5 }, { day: 'SUNDAY', index: 6 }]

  // useEffect(updateAssignments, [token, today])
  // function updateAssignments () {
  //   getAssignments(token).then(assignments => {
  //     setAssignments(assignments)
  //     // this is the rewind code for reseeding the data quickly
  //     for (const day of dayDict) {
  //       for (const assignment of assignments) {
  //         if (assignment.assignment_type === day.day && todayIndex <= day.index) {
  //           updateAssignment(token, assignment.pk, false).then(updateTeams())
  //         }
  //       }
  //     }
  //   })
  // }

  function handleTime (e) {
    setToday(e.target.value)
    if (e.target.value === 'MONDAY') {
      setTodayIndex(0)
    } else if (e.target.value === 'TUESDAY') {
      setTodayIndex(1)
    } else if (e.target.value === 'WEDNESDAY') {
      setTodayIndex(2)
    } else if (e.target.value === 'THURSDAY') {
      setTodayIndex(3)
    } else if (e.target.value === 'FRIDAY') {
      setTodayIndex(4)
    } else if (e.target.value === 'SATURDAY') {
      setTodayIndex(5)
    } else if (e.target.value === 'SUNDAY') {
      setTodayIndex(6)
    }
  }

  function handleLogout () {
    setToken(null)
    setUsername(null)
    setTeams([])
    setCaptain(false)
    setAvatar('')
    setMyTeam()
    setTeam()
    setMyPod()
    setMyPodFeedPk()
    setIsLoading(true)
  }

  return (
    <Router>
      <Navigation token={token} myTeam={myTeam} isCaptain={isCaptain} username={username} handleTime={handleTime} handleLogout={handleLogout} isLoggedIn={isLoggedIn} avatar={avatar} />
      <Switch>

        <Route path='/about'>
          <About />
        </Route>

        {/* CAPTAIN REG AND LOGIN */}
        <Route path='/login'>
          <Login isLoggedIn={isLoggedIn} setAuth={setAuth} />
        </Route>
        <Route path='/register'>
          <Register isLoggedIn={isLoggedIn} setAuth={setAuth} />
        </Route>

        {/* TEAM DASHBOARD */}

        <Route path='/team/:teamPk'>
          <div className='App' />
          <TeamDashboard token={token} profileUsername={username} today={today} todayIndex={todayIndex} myPod={myPod} feedPk={myPodFeedPk} isCaptain={isCaptain} setIsCreatingTeam={setIsCreatingTeam} />
        </Route>

        <Route path='/team-chores/:teamPk'>
          <div className='App' />
          <TeamChoreDashboard token={token} teams={teams} myTeam={myTeam} isCaptain={isCaptain} />
        </Route>

        <Route path='/create-team-dashboard'>
          <div className='App' />
          <CreateTeamDashboard token={token} profileUsername={username} setMyPod={setMyPod} isCreatingTeam={isCreatingTeam} setIsCreatingTeam={setIsCreatingTeam} />
        </Route>

        {/* CHORE ASSIGNMENT PAGE */}
        <Route path='/chore-assignment/:teamPk'>
          <div className='App' />
          <ChoreSummary token={token} today={today} todayIndex={todayIndex} />
        </Route>

        <Route path='/create-team-members/:teamPk/:teamName'>
          <div className='App' />
          <CreateTeamMembers token={token} isCreatingTeam={isCreatingTeam} setIsCreatingTeam={setIsCreatingTeam} />
        </Route>

        <Route path='/user-profile/:username'>
          <div className='App' />
          <UserProfile token={token} today={today} todayIndex={todayIndex} profileUsername={username} team={team} setTeam={setTeam} teams={teams} setTeams={setTeams} podPk={myPod} updateTeamScores={updateTeamScores} />
        </Route>

        {/* {Home Page for User Already on Team} */}

        <Route path='/'>
          {token
            ? (
              <div>
                {(teams && myPod)
                  ? <Homepage token={token} teams={teams} myTeam={myTeam} myPod={myPod} isCreatingTeam={isCreatingTeam} profileUsername={username} isCaptain={isCaptain} feedPk={myPodFeedPk} today={today} />
                  : <div>{(!isLoading) &&
                    <CreateTeamDashboard token={token} profileUsername={username} setMyPod={setMyPod} setIsCreatingTeam={setIsCreatingTeam} />}
                  </div>}

              </div>
              )
            : (
              <AltHomepage />
              )}
          {/* : <Welcome /> */}

        </Route>
      </Switch>
    </Router>
  )
}

export default App
