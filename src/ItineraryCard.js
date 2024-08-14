import React from 'react'
import './ItineraryCard.css'
import { useNavigate } from 'react-router-dom'

function ItineraryCard({ itineraryId, src, title, description, selectedDays, selectedCountry}) {
  const navigate = useNavigate();
  return (
    <div className='itinerary-card' onClick={() => {
      navigate(`/my-itineraries/${itineraryId}`, {
        state: {
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

export default ItineraryCard