import React from 'react'
import './DestinationCard.css'

function DestinationCard({ src, country, description, link }) {
  return (
    <div className='destination-card'>
      <a href={`/country/${country.toLowerCase()}`} className='destination-card-link'>
        <img className='destination-card-image' src={src} alt={country} />

        <div>
          <p className='destination-card-country'>{country}</p>
        </div>

        <div>
          <p className='destination-card-description'>{description}</p>
        </div>
      </a>
    </div>
  )
}

export default DestinationCard