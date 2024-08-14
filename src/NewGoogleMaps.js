import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { doc, setDoc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase/FirebaseConfig';
import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material';
import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";
import './GooglePlacesAndMaps.css';
import { addItinerary } from './FuncAddItinerary';
import { useParams } from 'react-router-dom';

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';
setKey("YOUR_API_KEY_HERE");

function loadScript(src, position, id) {
  return new Promise((resolve, reject) => {
    if (!position) {
      return reject(new Error('Position is not defined.'));
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Script loading error.'));
    position.appendChild(script);
  });
}

const libraries = ['places'];
const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
};

const autocompleteService = { current: null };

export default function NewGoogleMaps({ itineraryId }) {

  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [location, setLocation] = React.useState('');
  const loaded = React.useRef(false);

  const { day } = useParams()


  const [mapCenter, setMapCenter] = useState({
    lat: 1.282302, // default latitude
    lng: 103.858528, // default longitude
  })


  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        if (autocompleteService.current) {
          autocompleteService.current.getPlacePredictions(request, callback);
        }
      }, 400),
    [],
  );

  useEffect(() => {
    let active = true;

    if (inputValue !== '') autocompleteService.current =
      new window.google.maps.places.AutocompleteService();

    if (inputValue === '') setOptions(value ? [value] : []);

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handlePlaceChange = (event, newValue) => {
    (setValue(newValue))
    if (newValue) {
      // Update the map center based on the selected place
      fromAddress(inputValue)
        .then(({ results }) => {
          const { lat, lng } = results[0].geometry.location;
          console.log(lat, lng);
          setMapCenter({ lat: lat, lng: lng });
        })
        .catch(console.error);
      // setMapCenter({ lat: value.geometry.location.lat(), lng: value.geometry.location.lng() });
    }
  };

  const addPlaceToItinerary = async (itineraryId, day, place, lat, lng) => {
    try {
      const user = auth.currentUser;
      if (user) {

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        const country = countryDocSnap.data().country.label;

        const dayDocId = day.toString().padStart(2, '0');
        const itineraryRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        const itineraryDoc = await getDoc(itineraryRef);
        const countryItineraryRef = doc(db, 'countries', country, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        const countryItineraryDoc = await getDoc(countryItineraryRef);

        if (itineraryDoc.exists() && countryItineraryDoc.exists()) {
          const currentData = itineraryDoc.data();
          const currentDataCountry = countryItineraryDoc.data();

          await updateDoc(itineraryRef, {
            locations: [
              ...(currentData.locations || []), // Existing locations, if any
              {
                title: place, // Place details
                lat: lat,
                lng: lng
              }
            ]
          });

          await updateDoc(countryItineraryRef, {
            locations: [
              ...(currentDataCountry.locations || []), // Existing locations, if any
              {
                title: place, // Place details
                lat: lat,
                lng: lng
              }
            ]
          });

          console.log('Place added to itinerary');
        } else {
          console.error('Itinerary not found');
        }
      } else {
        console.error('User is not authenticated');
      }
    } catch (e) {
      console.error('Error adding place: ', e);
    }
  };


  React.useEffect(() => {
    if (value) {
      // Update the map center based on the selected place
      fromAddress(inputValue)
        .then(({ results }) => {
          const { lat, lng } = results[0].geometry.location;
          console.log(lat, lng);
          setMapCenter({ lat: lat, lng: lng });
        })
        .catch(console.error);
      // setMapCenter({ lat: value.geometry.location.lat(), lng: value.geometry.location.lng() });
    }
  }, [value]);


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'YOUR_API_KEY_HERE',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }



  return (
    <div className='main-body'>

      <div className='itinerary-day-details-card-container'>

        <div className='google-places-autocomplete'>
          <Autocomplete
            id="google-map-demo"
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="No locations"
            onChange={handlePlaceChange}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Add a location" fullWidth />
            )}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const matches =
                option.structured_formatting.main_text_matched_substrings || [];

              return (
                <li key={key} {...optionProps}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon style={{ color: 'gray' }} />
                    <div style={{ marginLeft: '10px' }}>
                      {option.description}
                    </div>
                  </div>
                </li>
              );
            }}
          />

          <Button onClick={() => {
            if (value !== null) addPlaceToItinerary(itineraryId, day, value.description, mapCenter.lat, mapCenter.lng)
          }}>
            Add
          </Button>
        </div>

        <div className='google-maps'>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={15}
          >
            {value && <Marker position={mapCenter} />}
          </GoogleMap>
        </div>

      </div>
    </div>
  );
}
