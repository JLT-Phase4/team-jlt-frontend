
import { useState } from 'react'
import { getMusicSamples } from './../api'

const MusicSearch = ({ token, setMusicTrack }) => {
  const [tracks, setTracks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  function getTracks (keyword) {
    getMusicSamples(keyword)
      .then(tracks => setTracks(tracks))
      .then(console.log(tracks))
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
        {/* <div className='flex'>
          {tracks.map(track => (
            <div className='track-thumbnail' onClick={() => setMusicTrack(track.urlToMp3)} track={track} key={track} style={{ backgroundImage: `url(${track.coverImg})` }} />
          ))}
          <div className='flex-col' style={{ justifyContent: 'center', alignItems: 'center' }} />
        </div> */}
      </div>
    </div>

  )
}

export default MusicSearch

// track-label is photo-label
// track-thumbnail is photo-thumbnail
// need card-detail-all class
// need create-card-header class
// need create-card-section class
// need button-style class
// need some kind of track_coverImg
// need some kind of track.urlToMp3
