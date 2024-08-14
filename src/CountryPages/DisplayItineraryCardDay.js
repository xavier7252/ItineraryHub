import React from 'react'
import './DisplayItineraryCardDay.css'

function DisplayItineraryCardDay({ itineraryId, src, title, summary, day, country }) {
  return (
    <div className='display-itinerary-card'>
      <a href={`/country/${country.toLowerCase()}/${itineraryId}/${day}`} className='itinerary-card-link'>
        <img className='itinerary-card-image' src={src} alt={title} />

        <div>
          <p className='itinerary-card-title'>{title}</p>
        </div>

        <div>
          <p className='itinerary-card-summary'>{summary}</p>
        </div>
      </a>
    </div>
  )
}

export default DisplayItineraryCardDay