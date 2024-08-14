import './CountryPages.css';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import DestinationCard from '../DestinationCard';
import sampleItineraries from '../data/SampleItineraries';
import DisplayItineraryCard from './DisplayItineraryCard';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/FirebaseConfig';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import CountryBanner from './CountryBanner';
import { doc, setDoc, getDoc, getDocs, onSnapshot, collection } from 'firebase/firestore';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const CountryPageGenerator = () => {

  const countryLabel = useParams();
  const countryNamee = countryLabel.countryLabel;
  console.log('countrylabel is:' ,countryNamee);

  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  // const [countryName, setCountryName] = useState(countryNamee);
  const [showButtonGroup, setShowButtonGroup] = useState(false);

  const [shortItineraries, setShortItineraries] = useState([]);
  const [mediumItineraries, setMediumItineraries] = useState([]);
  const [longItineraries, setLongItineraries] = useState([]);

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
    const itineraryRef = collection(db, 'countries', countryNamee, 'itineraries');

    // Set up a real-time listener
    const unsubscribe = onSnapshot(itineraryRef, (snapshot) => {
      const allItineraries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedItineraries = allItineraries.sort((a, b) => a.days - b.days);

      const shortThreshold = 7;
      const mediumThreshold = 14;

      const short = sortedItineraries.filter(itinerary => itinerary.days <= shortThreshold);
      const medium = sortedItineraries.filter(itinerary => itinerary.days > shortThreshold && itinerary.days <= mediumThreshold);
      const long = sortedItineraries.filter(itinerary => itinerary.days > mediumThreshold);

      setShortItineraries(short);
      setMediumItineraries(medium);
      setLongItineraries(long);

      console.log('shortitineraryis:', shortItineraries);
      console.log('mediumitineraryis:', mediumItineraries);
      console.log('longitineraryis:', longItineraries);

    }, (error) => {
      console.error('Error listening for itinerary updates:', error);
    });

    // Cleanup the listener when the component unmounts or countryName changes
    return () => unsubscribe();
  }); // Ensure to include dependencies for proper effect management


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


  return (
    <div className='App'>
      <div className="country-page">
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

        <div className="country-banner-row">
          <CountryBanner country={countryNamee}></CountryBanner>
        </div>

        <div className="main-body">
          <div className='short-trip-box'>
            <h2>Short Itineraries</h2>

            {shortItineraries.length === 0 ? (
              <p>No itineraries added yet.</p>
            ) : (
              <div className='itineraries-box'>
                {shortItineraries.map((itinerary, index) => (
                  <DisplayItineraryCard
                    key={index}
                    src={itinerary.src}
                    title={itinerary.title}
                    description={itinerary.description}
                    itineraryId={itinerary.id}
                    selectedCountry={itinerary.country}
                    selectedDays={itinerary.days}
                  />
                ))}
              </div>
            )}
          </div>

          <div className='medium-trip-box'>
            <h2>Medium Itineraries</h2>

            {mediumItineraries.length === 0 ? (
              <p>No itineraries added yet.</p>
            ) : (
              <div className='itineraries-box'>
                {mediumItineraries.map((itinerary, index) => (
                  <DisplayItineraryCard
                    key={index}
                    src={itinerary.src}
                    title={itinerary.title}
                    description={itinerary.description}
                    itineraryId={itinerary.id}
                    selectedCountry={itinerary.country}
                    selectedDays={itinerary.days}
                  />
                ))}
              </div>
            )}
          </div>

          <div className='long-trip-box'>
            <h2>Long Itineraries</h2>

            {longItineraries.length === 0 ? (
              <p>No itineraries added yet.</p>
            ) : (
              <div className='itineraries-box'>
                {longItineraries.map((itinerary, index) => (
                  <DisplayItineraryCard
                    key={index}
                    src={itinerary.src}
                    title={itinerary.title}
                    description={itinerary.description}
                    itineraryId={itinerary.id}
                    selectedCountry={itinerary.country}
                    selectedDays={itinerary.days}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 
        <div className='view-all-destinations-box'>
          <a className='link' href='' target='_blank '>View all</a>
        </div> */}

        </div>
      </div>
    </div>

  );
};

export default CountryPageGenerator;
