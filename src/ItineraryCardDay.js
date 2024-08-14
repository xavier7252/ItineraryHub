import React from 'react'
import './ItineraryCardDay.css'

function ItineraryCardDay({ itineraryId, src, title, summary, day }) {
  return (
    <div className='itinerary-card'>
      <a href={`/create-itinerary-details/${itineraryId}/${day}`} className='itinerary-card-link'>
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

export default ItineraryCardDay