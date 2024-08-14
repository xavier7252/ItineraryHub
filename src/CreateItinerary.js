import './CreateItinerary.css';
import Banner from './Banner';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import DestinationCard from './DestinationCard';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from './firebase/FirebaseConfig';
import countries from './data/Countries';
import { useFetcher, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import countriesArray from './data/ArrayOfCountries';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { addItinerary } from './FuncAddItinerary';

const CreateItinerary = () => {

  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showButtonGroup, setShowButtonGroup] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedDays, setSelectedDays] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  const handleNext = ({itineraryId}) => {
    navigate(`/my-itineraries/${itineraryId}`, {
      state: {
        selectedCountry,
        selectedDays,
      },
    });
    console.log(selectedCountry, selectedDays)
  };

  const handleAddItinerary = async () => {
    if (selectedCountry && selectedDays) {
      const itineraryId = await addItinerary(selectedCountry, selectedDays, title, description);
      console.log('selecteddays: ', selectedDays)
      if (itineraryId) {
        console.log('Created itinerary with ID:', itineraryId);
        handleNext({itineraryId});
      } else {
        setErrorMessage('Failed to create itinerary.');
        setTimeout(() => { setErrorMessage('') }, 2000);
      }
    } else {
      setErrorMessage('Please input all required values!');
      setTimeout(() => { setErrorMessage('') }, 2000);
    }
  }

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
        <h1>Create Your Itinerary</h1>

        <div className='itinerary-question-prompts'>
          <div className='first-question'>
            <h3>Where will you be going?*</h3>

            <Autocomplete
              disablePortal
              id=""
              options={countriesArray}
              sx={{ width: 350 }}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedCountry(newValue.label);
                } else {
                  setSelectedCountry('');
                }
              }}
              renderInput={(params) => <TextField {...params} label="Country" />}
            />
          </div>

          <div className='second-question'>
            <h3>How long is your trip?*</h3>

            <Autocomplete
              disablePortal
              id=""
              options={arrayOneToTwentyOne}
              sx={{ width: 350 }}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedDays(newValue.label);
                } else {
                  setSelectedDays('');
                }
              }}
              renderInput={(params) => <TextField {...params} label="Number of days" />}
            />
          </div>

          <div className='third-question'>
            <h3>Title*</h3>

            <TextField
              disablePortal
              id=""
              sx={{ width: 350 }}
              onChange={(event) => setTitle(event.target.value)}
              inputProps={{ maxLength: 40 }}
            />
          </div>

          <div className='fourth-question'>
            <h3>Description</h3>

            <TextField
              disablePortal
              id=""
              sx={{ width: 350 }}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              inputProps={{ maxLength: 500 }}
            />
          </div>

          <div className='create-button-box'>
            <Button variant="contained"
              onClick={() => {
                if (selectedCountry && selectedDays && title) {
                  handleAddItinerary();
                }

                else {
                  setErrorMessage('Please input required values!');
                  setTimeout(() => { setErrorMessage('') }, 2000);
                }
              }
              }>
              Create
            </Button>
            {errorMessage && <h4 className='error-message'>{errorMessage}</h4>}
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateItinerary

const arrayOneToTwentyOne = [
  { label: '1' },
  { label: '2' },
  { label: '3' },
  { label: '4' },
  { label: '5' },
  { label: '6' },
  { label: '7' },
  { label: '8' },
  { label: '9' },
  { label: '10' },
  { label: '11' },
  { label: '12' },
  { label: '13' },
  { label: '14' },
  { label: '15' },
  { label: '16' },
  { label: '17' },
  { label: '18' },
  { label: '19' },
  { label: '20' },
  { label: '21' }
]