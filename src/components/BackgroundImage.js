
import { useState } from 'react'
import { unsplashApi } from '../api'

const BackgroundImage = ({ token, setBackgroundImage }) => {
  const [images, setImages] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [pageNumber, setPageNumber] = useState(0)

  function getImages (keyword, page) {
    unsplashApi(keyword, page)
      .then(images => setImages(images))
  }

  function pageForward (keyword, page) {
    setPageNumber(page + 1)
    getImages(keyword, page + 1)
  }
  function pageBack (keyword, page) {
    setPageNumber(page - 1)
    getImages(keyword, page - 1)
  }

  function startImageSearch (keyword) {
    setPageNumber(1)

    getImages(keyword, 1)
  }

  return (
    <div className='card-detail-all'>
      <div className='create-card-section'>
        <div className='create-card-header'>Search Images</div>
        <label className='image-label' htmlFor='image'>Search Term</label>
        <input type='text' id='image' required value={searchTerm} onClick={evt => setSearchTerm('')} onChange={evt => setSearchTerm(evt.target.value)} />
        <button type='submit' className='log-reg-button' onClick={() => startImageSearch(searchTerm)}>Get Image</button>
        {images && (
          <div className='search-results-container'>Select an Image Below
            <div className='flex'>
              {images.map(image => (
                <div style={{ width: '180px', height: '130px' }} image={image} key={image.id}>
                  <div className='photo-image-thumbnail' onClick={() => setBackgroundImage(image.urls.regular)} style={{ backgroundImage: `url(${image.urls.regular})` }} />
                  <div className='flex-col' style={{ justifyContent: 'center', alignItems: 'center' }} />
                </div>
              ))}
              {(pageNumber === 1) && (
                <button className='log-reg-button' onClick={() => pageForward(searchTerm, pageNumber)}><span>Next</span></button>
              )}
              {(pageNumber > 1) && (
                <>
                  <button className='log-reg-button' onClick={() => pageBack(searchTerm, pageNumber)}><span>Previous</span></button>
                  <button className='log-reg-button' onClick={() => pageForward(searchTerm, pageNumber)}><span>Next</span></button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>

  )
}

export default BackgroundImage
