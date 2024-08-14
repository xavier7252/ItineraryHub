import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/FirebaseConfig';
import countries from '../data/Countries';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import countriesArray from '../data/ArrayOfCountries';
import { useLocation } from 'react-router-dom';
import DisplayItineraryCardDay from './DisplayItineraryCardDay';

const CountryItineraryDetails = () => {

  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showButtonGroup, setShowButtonGroup] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [numDays, setNumDays] = useState('');

  const navigate = useNavigate();

  const location = useLocation();
  const { selectedCountry } = location.state || {};

  // const numberOfDays = parseInt(selectedDays, 10);
  const { itineraryId } = useParams();

  const [cardData, setCardData] = useState([]);


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
    const fetchItineraryData = async () => {
      // Reference to the specific itinerary's dayItinerary sub-collection
      const dayItineraryRef = collection(db, 'countries', selectedCountry, 'itineraries', itineraryId, 'dayItinerary');
      const querySnapshot = await getDocs(dayItineraryRef);

      // Map through the documents and set card data
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id, // Include the document ID if needed
        ...doc.data() // Spread the document data
      }));

      setCardData(data);
    };

    fetchItineraryData();
  }, [itineraryId]);

  useEffect(() => {
    const fetchItineraryHeaders = async () => {
      // Reference to the specific itinerary document
      const itineraryDocRef = doc(db, 'countries', selectedCountry, 'itineraries', itineraryId);
      const docSnapshot = await getDoc(itineraryDocRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCountry(data.country);
        setNumDays(data.days);
      } else {
        console.error('Document not found');
      }
    } 

    fetchItineraryHeaders();
  }, [itineraryId]);

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
    <div className='create-itinerary'>
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
      <div className='title-and-info'>
          <div className='title-and-delete-button'>
            <h1 className='title'>{title}</h1>
          </div>
          <div className='description-and-button'>
            <h3 className='description'>{description}</h3>
          </div>
          <div className='mini-info'>
            <h3>Country: {country}</h3>
            <h3>Number of days: {numDays}</h3>
          </div>
        </div>

        <div className='render-button-list'>

          {cardData.map(card => (
            <DisplayItineraryCardDay
              key={card.day}
              itineraryId={itineraryId}
              src={card.src}
              title={card.title}
              summary={card.summary}
              day={card.day}
              country={selectedCountry}
            />
          ))}

        </div>
      </div>
    </div>
  )
}

export default CountryItineraryDetails