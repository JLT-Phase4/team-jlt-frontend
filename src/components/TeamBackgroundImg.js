
function TeamBackgroundImage ({ imageQuery, setImageQuery, handleImgSearch, setImageDisplay, setIsDisplaying }) {
  return (
    <div>
      <div>Team Background</div>
      <div>
        <form onSubmit={handleImgSearch}>
          <input
            className='img-search-input'
            type='text'
            placeholder='search for team image'
            value={imageQuery}
            onChange={event => setImageQuery(event.target.value)}
          />
          <button
            className='img-search-btn'
            type='submit'
          >Search
          </button>
          <button
            onClick={() => { setImageQuery(''); setImageDisplay([]); setIsDisplaying(false) }}
            className='img-search-btn'
            type='button'
          >Clear
          </button>
        </form>
      </div>
    </div>
  )
}

export default TeamBackgroundImage
