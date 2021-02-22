
const _MusicSearch = ({ token, setMusicTrack }) => {
  const track = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview114/v4/da/74/01/da7401d5-8900-dd60-720f-5f533f53a76d/mzaf_5156312338931626058.plus.aac.p.m4a'
  function handleTrack () {
    setMusicTrack(track)
  }
  return (
    <div className='card-detail-all'>
      <button onClick={() => handleTrack()}>Set Track</button>
    </div>

  )
}

export default _MusicSearch
