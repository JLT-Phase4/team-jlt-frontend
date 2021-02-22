
const _BackgroundImage = ({ token, setBackgroundImage }) => {
  const backgroundImage = 'https://images.unsplash.com/photo-1529456589219-228196a9c50d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2038&q=80'
  function handleImage () {
    setBackgroundImage(backgroundImage)
  }
  return (
    <div className='card-detail-all'>
      <button onClick={() => handleImage()}>Set Image</button>
      <div className='search-results-container' style={{ border: 'solid 2px' }}>Search Results</div>

    </div>
  )
}

export default _BackgroundImage
