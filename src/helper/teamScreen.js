import { getChores, getTeam, postAssigment, getAssignments, getUserProfile, updateAssignment } from './../api'

export function getTargetProfiles (token, team, username, teamView, setUserProfiles) {
  // if (team) {
  let allUserProfiles = []
  console.log('getting target profiles')
  console.log(team, 'this is team data')
  if (teamView === true) {
    for (const member of team.members) {
      getUserProfile(token, member.username).then(profile => {
        allUserProfiles = allUserProfiles.concat(profile)
        for (const profile of allUserProfiles) {
          let possiblePoints = 0
          console.log('type of assignments', typeof (profile.assignments))
          for (const assignment of profile.assignments) {
            possiblePoints += assignment.chore.points
          }
          profile.possiblePoints = possiblePoints
          console.log('I am updating profiles')
        }
        setUserProfiles(allUserProfiles)
      }
      )
    }
  } else {
    getUserProfile(token, username).then(profile => {
      allUserProfiles = allUserProfiles.concat(profile)
      for (const profile of allUserProfiles) {
        let possiblePoints = 0
        console.log('type of assignments', typeof (profile.assignments))
        for (const assignment of profile.assignments) {
          possiblePoints += assignment.chore.points
        }
        profile.possiblePoints = possiblePoints
        console.log('I am updating profiles')
      }
      setUserProfiles(allUserProfiles)
    }
    )
  }
  // }
}
