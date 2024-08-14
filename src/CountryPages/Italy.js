import './CountryPages.css';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import DestinationCard from '../DestinationCard';
import sampleItineraries from '../data/SampleItineraries';
import ItineraryCard from '../ItineraryCard';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/FirebaseConfig';
import { useFetcher, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';

const Italy = () => {
  
  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');

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

      // // Store user data in Firestore
      // await setDoc(userDocRef, {
      //   displayName: user.displayName,
      //   email: user.email,
      //   username: username, // Preserve existing username if available
      // });

      navigate('/profile');
    } catch (error) {
      console.error('Error signing in with Google or storing user data:', error);
    }
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
            <Button className='profile' onClick={() => navigate('/profile')}>
              <PersonIcon className='person-icon'></PersonIcon>
              <p className='profile-text'>
                {username}
              </p>
            </Button>
          ) : (
            <IconButton className='profile' onClick={handleGoogleSignIn}>
              <PersonIcon className='person-icon'></PersonIcon>
              Sign In
            </IconButton>
          )}
        </div>
      </div>

        <div className="main-body">
          <div className='number-of-days-box'>
            <p className='number-of-days-value'>5 days</p>
          </div>
          <div className='itinerary-box'>

            {sampleItineraries.map((title, index) => (
              <ItineraryCard
                key={index}
                src={title.image}
                title={title.name}
                description={title.description}
                link={title.destinationsLink}
              />
            ))}

          </div>
          <div className='view-all-destinations-box'>
            <a className='link' href='' target='_blank '>View all</a>
          </div>

          {/* <a className='destination-view-all' href="viewall" target='_blank'></a> */}
        </div>
      </div>
    </div>

  );
};

export default Italy;
