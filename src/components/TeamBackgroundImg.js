
function TeamBackgroundImage ({ setSelectedImage, imageQuery, setImageQuery, handleImgSearch, setImageDisplay, setIsDisplaying }) {
  return (
    <div>
      <div>Team Background</div>
      <div>
        <form onSubmit={handleImgSearch}>
          <input
            className='img-search-input'
            type='text'
            placeholder='search background img'
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

      <div className='object-value'>Color
        <div className='select-tag' value={setImageDisplay} onChange={event => { setSelectedImage('') }}> </div>
      </div>
    </div>
  )
}

export default TeamBackgroundImage
