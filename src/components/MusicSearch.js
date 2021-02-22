
import { useState } from 'react'
import { getMusicSamples } from './../api'

const MusicSearch = ({ token, setMusicTrack }) => {
  const [tracks, setTracks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  function getTracks (keyword) {
    getMusicSamples(keyword)
      .then(tracks => setTracks(tracks))
    if (tracks) {
      console.log(tracks[0])
    }
  }

  function startMusicSearch (keyword) {
    getTracks(keyword)
  }

  return (
    <div className='card-detail-all'>
      <div className='create-card-section'>
        <div className='create-card-header'>Search for Tracks</div>
        <label className='track-label' htmlFor='track'>Search Term</label>
        <input type='text' id='track' required value={searchTerm} onClick={evt => setSearchTerm('')} onChange={evt => setSearchTerm(evt.target.value)} />
        <button type='submit' className='button-style' onClick={() => startMusicSearch(searchTerm)}>Get Music</button>
        {tracks && (
          <div className='search-results-container' style={{ border: 'solid 2px' }}>Search Results
            <div className='flex'>
              {tracks.map(track => (
                <div style={{ width: '120px', height: '130px' }} track={track} key={track.trackId}>
                  <div className='track-thumbnail' onClick={() => setMusicTrack(track.previewUrl)} style={{ backgroundImage: `url(${track.artworkUrl100})` }} />
                  <div className='flex-col' style={{ justifyContent: 'center', alignItems: 'center' }}>{track.trackName}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>

  )
}

export default MusicSearch
