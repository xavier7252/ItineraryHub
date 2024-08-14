import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import DestinationCard from './DestinationCard';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from './firebase/FirebaseConfig';
import countries from './data/Countries';
import { useFetcher, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, getDocs, onSnapshot, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import './MyItineraries.css'
import ItineraryCard from './ItineraryCard';
import { useParams } from 'react-router-dom';

const MyItineraries = () => {

  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showButtonGroup, setShowButtonGroup] = useState(false);
  const [itineraries, setItineraries] = useState([]);

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
      const itineraryRef = collection(db, 'users', user.uid, 'itineraries');

      // Set up a real-time listener
      const unsubscribe = onSnapshot(itineraryRef, (snapshot) => {
        const allItineraries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItineraries(allItineraries);
      }, (error) => {
        console.error('Error listening for itinerary updates:', error);
      });

      // Cleanup the listener when the component unmounts or itineraryId changes
      return () => unsubscribe();
    } else {
      console.error('User is not authenticated');
    }
  });

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
    <div className='my-itineraries'>
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
        <div className='title-row'>
          <div className='title'>
            My Itineraries
          </div>

          <div className='create-itinerary-box'>
            <Button className='create-itinerary-button' onClick={() => navigate('/create-itinerary')} variant="contained">Create Itinerary</Button>
          </div>
        </div>

        {itineraries.length === 0 ? (
          <p>No itineraries added yet.</p>
        ) : (
          <div className='itineraries-box'>
            {itineraries.map((itinerary, index) => (
              <ItineraryCard
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

    </div>
  )
}

export default MyItineraries