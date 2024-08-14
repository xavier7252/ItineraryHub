import React from 'react'
import { useState, useEffect } from 'react';
import './Profile.css';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import { Avatar } from '@mui/material';
import { orange } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import Input from '@mui/material/Input';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/FirebaseConfig';
import TextField from '@mui/material/TextField';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase/FirebaseConfig';
import Button from '@mui/material/Button';
import { getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import SaveIcon from '@mui/icons-material/Save';

const Profile = () => {

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || '');

        // Fetch username from Firestore
        const docRef = doc(db, 'users', user.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUsername(userData.username || ''); // Set username from Firestore
            setDisplayName(userData.displayName || '');
            setEmail(userData.email || '');
          }
        }).catch((error) => {
          console.error('Error fetching user data:', error);
        });
      } else {
        setDisplayName('');
        setUsername('');
        setEmail('');
      }
    });

    return () => unsubscribe();
  }, []);


  const handleEditNameClick = () => {
    setIsEditingName(!isEditingName);
  };

  const handleEditUsernameClick = () => {
    setIsEditingUsername(!isEditingUsername);
  };

  const handleNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const saveChanges = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          displayName: displayName.trim(),
          email: user.email,
          username: username.trim(), // Update username in Firestore
        });

        console.log('Profile updated successfully!');
        setIsEditingName(false);
        setIsEditingUsername(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveChanges();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      setDisplayName('');
      setUsername('');
      setEmail('');

      console.log('User signed out successfully!');
      navigate('/'); // Redirect to home or login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='profile-page'>
      <div className="top-row">
        <div className='logo-box'>
          <button className='logo' onClick={() => navigate('/')}></button>
        </div>
      </div>

      <div className='main-body'>

        <div className='profile-title'>
          Profile
        </div>
        <div className='profile-image-box'>
          <Avatar className='profile-image' sx={{ bgcolor: orange[500] }}>
            {displayName ? displayName[0] : 'U'}
          </Avatar>
        </div>
        <div className='profile-details-box'>

          {/* ROW NUMBER 1 */}
          <div className='profile-name-box'>
            <div className='profile-name-category'>
              Name
            </div>

            {isEditingName ? (
              <TextField
                value={displayName}
                onChange={handleNameChange}
                variant="outlined"
                size="small"
                autoFocus
                onKeyPress={handleKeyPress} // Allow Enter key to save changes
              />
            ) : (
              <div className='profile-name-user'>{displayName}</div>
            )}

            <div className='edit-icon-box'>
              {isEditingName ? (
                <SaveIcon
                  className='save-icon save-icon-name'
                  onClick={saveChanges}
                />
              ) : (
                <EditIcon
                  className='edit-icon edit-icon-name'
                  onClick={() => setIsEditingName(true)}
                />
              )}
            </div>
          </div>

          {/* ROW NUMBER 2 */}
          <div className='profile-username-box'>
            <div className='profile-username-category'>
              Username
            </div>

            {isEditingUsername ? (
              <TextField
                value={username}
                onChange={handleUsernameChange}
                variant="outlined"
                size="small"
                onKeyPress={handleKeyPress}
                inputProps={{ maxLength: 15 }}
              />
            ) : (
              <div className='profile-username-user'>{username}</div>
            )}


            <div className='edit-icon-box'>
              {isEditingUsername ? (
                  <SaveIcon
                    className='save-icon save-icon-username'
                    onClick={saveChanges}
                  />
                ) : (
                  <EditIcon
                    className='edit-icon edit-icon-name'
                    onClick={() => setIsEditingUsername(true)}
                  />
                )}
            </div>
          </div>

          {/* ROW NUMBER 3 */}
          <div className='profile-email-box'>
            <div className='profile-email-category'>
              Email
            </div>
            <div className='profile-email-user'>
              {email}
            </div>
          </div>

          <div className='profile-gender-box'>
            <div className='profile-gender-category'>
              Gender
            </div>
            <div className='profile-gender-user'>
              Male
            </div>
          </div>

        </div>

        <div className='sign-out-button-box'>
          <Button variant="outlined" color="error" onClick={handleSignOut}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Profile