import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/FirebaseConfig';
import countries from '../data/Countries';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import countriesArray from '../data/ArrayOfCountries';
import { List, ListItem, ListItemText } from '@mui/material';
import GooglePlacesSearch from '../GooglePlacesSearch';
import { Loader } from "@googlemaps/js-api-loader"
import GoogleMaps from '../GoogleMaps';
import GooglePlacesAndMaps from '../GooglePlacesAndMaps';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection, onSnapshot } from 'firebase/firestore';

const CountryItineraryDayDetails = () => {

  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showButtonGroup, setShowButtonGroup] = useState(false);

  const [locations, setLocations] = useState([]);
  const [displayTitleMessage, setDisplayTitleMessage] = useState('');
  const [displaySummaryMessage, setDisplaySummaryMessage] = useState('');
  const [displayDescriptionMessage, setDisplayDescriptionMessage] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');

  const { itineraryId } = useParams();
  const { countryLabel } = useParams();

  const handlePlaceChange = (value) => {
    setInputValue(value);
  };

  const { day } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSignedIn(!!user);

      try {
        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsername(userData.username || '');
          }
        })
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const dayDocId = day.toString().padStart(2, '0');
      const itineraryRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);

      // Set up a real-time listener
      const unsubscribe = onSnapshot(itineraryRef, (snapshot) => {
        if (snapshot.exists()) {
          const currentData = snapshot.data();
          setLocations(currentData.locations || []);
        } else {
          console.error('Itinerary not found');
        }
      }, (error) => {
        console.error('Error listening for itinerary updates:', error);
      });

      // Cleanup the listener when the component unmounts or itineraryId changes
      return () => unsubscribe();
    } else {
      console.error('User is not authenticated');
    }
  }, [itineraryId]);


  useEffect(() => {
    const fetchDescription = async () => {

      const dayDocId = day.toString().padStart(2, '0');
      const dayDocRef = doc(db, 'countries', capitalizeFirstLetter(countryLabel), 'itineraries', itineraryId, 'dayItinerary', dayDocId);
      const dayDoc = await getDoc(dayDocRef);
      if (dayDoc.exists()) {
        setDescription(dayDoc.data().description || ''); // Set the existing description
      }
    };

    fetchDescription();
  }, [itineraryId, day]);

  useEffect(() => {
    const fetchTitle = async () => {

      const dayDocId = day.toString().padStart(2, '0');
      const dayDocRef = doc(db, 'countries', capitalizeFirstLetter(countryLabel), 'itineraries', itineraryId, 'dayItinerary', dayDocId);
      const dayDoc = await getDoc(dayDocRef);
      if (dayDoc.exists()) {
        setTitle(dayDoc.data().title || ''); // Set the existing description
      }
    };

    fetchTitle();
  }, [itineraryId, day]);

  useEffect(() => {
    const fetchSummary = async () => {

      const dayDocId = day.toString().padStart(2, '0');
      const dayDocRef = doc(db, 'countries', capitalizeFirstLetter(countryLabel), 'itineraries', itineraryId, 'dayItinerary', dayDocId);
      const dayDoc = await getDoc(dayDocRef);
      if (dayDoc.exists()) {
        setSummary(dayDoc.data().summary || ''); // Set the existing summary
        console.log('summary: ', summary);
      }
    };

    fetchSummary();
  }, [itineraryId, day]);

  useEffect(() => {
    const fetchLocations = async () => {

      const dayDocId = day.toString().padStart(2, '0');
      const dayDocRef = doc(db, 'countries', capitalizeFirstLetter(countryLabel), 'itineraries', itineraryId, 'dayItinerary', dayDocId);
      const dayDoc = await getDoc(dayDocRef);
      if (dayDoc.exists()) {
        setLocations(dayDoc.data().locations || []);
      }
    };

    fetchLocations();
  }, [itineraryId, day]);

   // Function to capitalize the first letter
   const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log('Signed in user:', user);

      // Reference to the user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);

      // Fetch existing user data from Firestore
      const userDocSnap = await getDoc(userDocRef);
      let username = '';
      let displayName = '';
      let email = '';

      if (userDocSnap.exists()) {
        // If the document exists, use the existing username
        const userData = userDocSnap.data();
        username = userData.username || ''; // Use existing username if available
        displayName = userData.displayName || '';
        email = userData.email || '';

        setUsername(username);
      }

      navigate('/profile');
    } catch (error) {
      console.error('Error signing in with Google or storing user data:', error);
    }
  };

  const handleProfileClick = () => {
    setShowButtonGroup((prev) => !prev);
  };

  const handleClickAway = () => {
    setShowButtonGroup(false);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Reference to the specific day's document
        const dayDocId = day.toString().padStart(2, '0');
        const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        await updateDoc(dayDocRef, {
          description: description.trim(), // Update the document with the new description
          title: title.trim(),
          summary: summary.trim()
        });

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        const country = countryDocSnap.data().country;
        console.log("country is: " + country);

        const dayCountryDocRef = doc(db, 'countries', country, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        await updateDoc(dayCountryDocRef, {
          description: description.trim(), // Update the document with the new description
          title: title.trim(),
          summary: summary.trim()
        });

        console.log('Document saved successfully');

      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  const handleDeleteLocation = async (index) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const updatedLocations = locations.filter((_, i) => i !== index);
        setLocations(updatedLocations);

        const dayDocId = day.toString().padStart(2, '0');
        const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        await updateDoc(dayDocRef, {
          locations: updatedLocations
        });

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        const country = countryDocSnap.data().country;

        const dayCountryDocRef = doc(db, 'countries', country, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        await updateDoc(dayCountryDocRef, {
          locations: updatedLocations
        });
        console.log('Location deleted successfully');
      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const openInGoogleMaps = (location) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.title)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className='itinerary-day-details'>
      <div className="top-row">
        <div className='logo-box'>
          <Button className='logo' onClick={() => navigate('/')}></Button>
        </div>

        <div className='profile-box'>
          {signedIn ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <div className='profile-box-1'>
                <Button className='profile' onClick={handleProfileClick}>
                  <PersonIcon className='person-icon'></PersonIcon>
                  <p className='profile-text'>{username}</p>
                </Button>
                {showButtonGroup && (
                  <ButtonGroup
                    orientation="vertical"
                    aria-label="vertical outlined button group"
                    className="button-group"
                  >
                    <Button className='navigate-profile' onClick={() => navigate('/profile')}>Profile</Button>
                    <Button className='navigate-itinerary' onClick={() => navigate('/my-itineraries')}>My Itineraries</Button>
                  </ButtonGroup>
                )}
              </div>
            </ClickAwayListener>
          ) : (
            <IconButton className='profile' onClick={handleGoogleSignIn}>
              <PersonIcon className='person-icon'></PersonIcon>
              Sign In
            </IconButton>
          )}
        </div>
      </div>

      <div className='main-body'>

        <div className='itinerary-day-details-card-container'>

          <div className='itinerary-day-details-card-title'>
            <h4>Title</h4>
            <div>{title}</div>
          </div>

          <div className='itinerary-day-details-card-summary'>
            <h4>Summary</h4>
            <div>{summary}</div>
          </div>

          <div className='itinerary-day-details-card-description'>
            <h4>Description</h4>
            <div>{description}</div>
          </div>

          <div className='places-to-visit'>
            <h4 className='itinerary-day-details-card-title'>Places to visit</h4>
            {locations.length === 0 ? (
              <p>No locations added yet.</p>
            ) : (
              <div>
                {locations.map((location, index) => (
                  <div
                  key={index}
                  className='location-entry-box'
                  onClick={() => openInGoogleMaps(location)}
                >
                    <div className='location-entry-text'>
                      {index + 1}: &nbsp;{location.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div className='google-maps'>
            <GooglePlacesAndMaps itineraryId={itineraryId} />
          </div> */}

          {/* <div className='list-of-places'>
            <h4>Current Locations</h4>
            {locations.length === 0 ? (
              <p>No locations added yet.</p>
            ) : (
              <div>
                {locations.map((location, index) => (
                  <div className='location-entry-box'>
                    <div>{index + 1}: &nbsp;{location.title}</div>
                    <Button onClick={() => handleDeleteLocation(index)}>Delete</Button>
                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  )

};

export default CountryItineraryDayDetails;
