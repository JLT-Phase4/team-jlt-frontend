import { VictoryAxis, VictoryBar, VictoryStack, VictoryChart } from 'victory'

function ResultsSummaryBar ({
  summary
}) {
  const dataCorrect = [
    { difficulty: 'TOTAL', correct: summary * 100 }
  ]

  const dataTotal = [
    { difficulty: 'TOTAL', correct: 100 }
  ]
  return (
    <>
      <VictoryChart horizontal style={{ background: { fill: '#00000078' } }} width={600} height={200} domain={{ y: [0.5, 100] }}>
        <VictoryStack colorScale={['#00ff00', '#fdfcf34a']}>
          <VictoryBar
            data={dataCorrect} x='difficulty' y='correct'
            style={{ data: { format: 0 }, labels: { fill: '#dbd8d8' } }}
          />
          <VictoryBar
            data={dataTotal} x='difficulty' y='correct'
          />
        </VictoryStack>
        {/* <VictoryAxis
          dependentAxis
          label='Total Questions'
          style={{ tickLabels: { fill: '#dbd8d8', fontSize: '12px' }, axisLabel: { fill: '#dbd8d8', fontFamily: 'Potta One' } }}
        />
        <VictoryAxis
          label='Difficulty'
          style={{ tickLabels: { fill: '#dbd8d8', fontSize: '12px' }, axisLabel: { fill: '#dbd8d8', fontFamily: 'Potta One' } }}
        /> */}
      </VictoryChart>
    </>
  )
}

export default ResultsSummaryBar
