import './Home.css';
import Banner from './Banner';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import DestinationCard from './DestinationCard';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from './firebase/FirebaseConfig';
import countries from './data/Countries';
import { useFetcher, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';

function Home({ isLoggedIn }) {

  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showButtonGroup, setShowButtonGroup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSignedIn(!!user);

      try{
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

  return (

    <div className="Home">
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

      <div className="banner-row">
        <Banner></Banner>
      </div>

      <div className="main-body">
        <div className='destination-title-box'>
          <p className='destination-title'>Destinations</p>
        </div>

        <div className='destination-box'>
          {countries.map((country, index) => (
            <DestinationCard
              key={index}
              src={country.image}
              country={country.name}
              description={country.description}
              link={country.destinationsLink}
            />
          ))}

        </div>
        <div className='view-all-destinations-box'>
          <a className='link' href='' target='_blank '>View all</a>
        </div>

        {/* <a className='destination-view-all' href="viewall" target='_blank'></a> */}
      </div>
    </div>
  );
}

export default Home;
