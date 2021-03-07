
const Welcome = (props) => {
  return (
    <div>
      <div className='App welcome-page' />
      <h2>Welcome to Chore Wars!</h2>
      <img className='logo-image' width='200' height='200' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqBhhVt6J7_Um29hkn98B85xfFHkDnT5TB2w&usqp=CAU' alt='' />
      <div className='welcome-text1'>
        <p>Sign up here to get chores done while having fun!</p>
        <p>Compete against family members,</p>
        <p>neighboring households and friends</p>
        <p>to find out who will be the next Chore Wars champion.</p>
      </div>
      <div className='welcome-text2'>
        <p>Chore Wars is a free app that helps your family</p>
        <p>achieve individual goals by gamifying everyday tasks.</p>
        <p>Create a team to assign chores</p>
        <p> to members of your household.</p>
        <p> Track individual and team progress</p>
        <p>and compare with other teams.</p>
        <p>It's easy to use, and a whole lot of fun.  Let's get started!</p>
      </div>

    </div>
  )
}

export default Welcome
