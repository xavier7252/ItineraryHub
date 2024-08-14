import React, { useState, useEffect } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
};

const GoogleMaps = ({ inputValue }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_API_KEY_HERE',
    libraries,
  });

  const [mapCenter, setMapCenter] = useState({
    lat: 1.282302, // default latitude
    lng: 103.858528, // default longitude
  })

  useEffect(() => {
    if (inputValue) {
      // Update the map center based on the selected place
      setMapCenter({ lat: inputValue.geometry.location.lat(), lng: inputValue.geometry.location.lng() });
    }
  }, [inputValue]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={mapCenter}
      >
        <Marker position={mapCenter} />
      </GoogleMap>
    </div>
  );
}

export default GoogleMaps