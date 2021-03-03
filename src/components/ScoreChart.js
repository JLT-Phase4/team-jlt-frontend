
import scoreSummary from './../fakeTeams'
import { MDBContainer } from 'mdbreact'
import { Line } from 'react-chartjs-2'

const ScoreChart = ({ userProfile, today, todayIndex }) => {
  let mondayScore = 0
  let tuesdayScore = 0
  let wednesdayScore = 0
  let thursdayScore = 0
  let fridayScore = 0
  let saturdayScore = 0
  let sundayScore = 0

  if (userProfile) {
    mondayScore = userProfile.monday_chore_points.chore__points__sum
    tuesdayScore = mondayScore + userProfile.tuesday_chore_points.chore__points__sum
    wednesdayScore = tuesdayScore + userProfile.wednesday_chore_points.chore__points__sum
    thursdayScore = wednesdayScore + userProfile.thursday_chore_points.chore__points__sum
    fridayScore = thursdayScore + userProfile.friday_chore_points.chore__points__sum
    saturdayScore = fridayScore + userProfile.saturday_chore_points.chore__points__sum
    sundayScore = saturdayScore + userProfile.sunday_chore_points.chore__points__sum
  }

  const scoreSummary = {
    dataLine: {
      labels: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],

      datasets: [
        {
          label: 'Scores',
          // fill: true,
          lineTension: 0.3,
          backgroundColor: 'rgba(225, 204,230, .3)',
          borderColor: 'rgb(205, 130, 158)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgb(205, 130,1 58)',
          pointBackgroundColor: 'rgb(255, 255, 255)',
          pointBorderWidth: 10,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgb(0, 0, 0)',
          pointHoverBorderColor: 'rgba(220, 220, 220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [mondayScore, tuesdayScore, wednesdayScore, thursdayScore, fridayScore, saturdayScore, sundayScore]
          // data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    }
  }

  return (
    <>
      {userProfile && (
        <MDBContainer>
          <h3 className='mt-5'>Line chart</h3>
          <Line data={scoreSummary.dataLine} options={{ responsive: true }} />
        </MDBContainer>

      )}
    </>
  )
}

export default ScoreChart
