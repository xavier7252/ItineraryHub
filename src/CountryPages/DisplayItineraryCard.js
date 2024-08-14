import React from 'react'
import './DisplayItineraryCard.css'
import { useNavigate } from 'react-router-dom'

function DisplayItineraryCard({ itineraryId, src, title, description, selectedDays, selectedCountry}) {
  const navigate = useNavigate();
  const country = selectedCountry.toLowerCase();
  return (
    <div className='itinerary-card' onClick={() => {
      navigate(`/country/${country}/${itineraryId}`, {
        state: {
          title,
          description,
          selectedCountry,
          selectedDays
        },
      });
    } }>
        <img className='itinerary-card-image' src={src} alt={title} />

        <div>
          <div className='itinerary-card-title'>{title}</div>
        </div>

        <div>
          <p className='itinerary-card-description'>{description}</p>
        </div>
    </div>
  )
}

export default DisplayItineraryCard