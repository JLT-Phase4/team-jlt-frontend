
import { useState } from 'react'
import { unsplashApi } from '../api'

const BackgroundImage = ({ token, setBackgroundImage }) => {
  const [images, setImages] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  function getImages (keyword) {
    unsplashApi(keyword)
      .then(images => setImages(images))
    if (images) {
      console.log(images)
    }
  }

  function startImageSearch (keyword) {
    getImages(keyword)
  }

  return (
    <div className='card-detail-all'>
      <div className='create-card-section'>
        <div className='create-card-header'>Search Images</div>
        <label className='image-label' htmlFor='image'>Search Term</label>
        <input type='text' id='image' required value={searchTerm} onClick={evt => setSearchTerm('')} onChange={evt => setSearchTerm(evt.target.value)} />
        <button type='submit' className='log-reg-button' onClick={() => startImageSearch(searchTerm)}>Get Image</button>
        {images && (
          <div className='search-results-container' style={{ border: 'solid 2px' }}>Search Results
            <div className='flex'>
              {images.map(image => (
                <div style={{ width: '120px', height: '130px' }} image={image} key={image.id}>
                  <div className='image-thumbnail' onClick={() => setBackgroundImage(image.urls.regular)} style={{ backgroundImage: `url(${image.urls.regular})` }} />
                  <div className='flex-col' style={{ justifyContent: 'center', alignItems: 'center' }} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>

  )
}

export default BackgroundImage
