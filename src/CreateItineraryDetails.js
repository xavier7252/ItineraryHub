import './CreateItinerary.css';
import Banner from './Banner';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import DestinationCard from './DestinationCard';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from './firebase/FirebaseConfig';
import countries from './data/Countries';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import countriesArray from './data/ArrayOfCountries';
import { useLocation } from 'react-router-dom';
import ItineraryCardDay from './ItineraryCardDay';
import './CreateItineraryDetails.css';
import { OvalDropDownButton } from './Tools/OvalDropDownButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateItineraryDetails = () => {

  const [signedIn, setSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showButtonGroup, setShowButtonGroup] = useState(false);

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [country, setCountry] = useState('');
  const [numDays, setNumDays] = useState('');

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isEditingNumDays, setIsEditingNumDays] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const [uploading, setUploading] = useState(false); // To track uploading status
  const [properties, setProperties] = useState(false);
  const [editItineraryDetails, setEditItineraryDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const location = useLocation();
  // const { numDays } = location.state || {};

  const { itineraryId } = useParams();

  const [cardData, setCardData] = useState([]);

  // Use Effects for Itinerary Properties
  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            setDescription(dayDoc.data().description || ''); // Set the existing description
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching description:', error);
      }
    };

    fetchDescription();
  }, [itineraryId]);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            setTitle(dayDoc.data().title || ''); // Set the existing description
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching title:', error);
      }
    };

    fetchTitle();
  }, [itineraryId]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            setCountry(dayDoc.data().country || ''); // Set the existing description
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching country:', error);
      }
    };

    fetchCountry();
  }, [itineraryId]);

  useEffect(() => {
    const fetchNumDays = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            setNumDays(dayDoc.data().days || ''); // Set the existing description
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching numDays:', error);
      }
    };

    fetchNumDays();
  }, [itineraryId]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            const data = dayDoc.data();
            setImageURL(data.src || ''); // Set the existing image URL
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [itineraryId]);

  useEffect(() => {
    const uploadImage = async () => {
      if (imageURL) {
        await handleImageUpload();
      }
    };

    uploadImage();
  }, [imageURL]); // Dependency array includes imageURL

  // Use Effects for Firebase login
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

  // Use Effects for Itinerary Day Data
  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Reference to the specific itinerary's dayItinerary sub-collection
          const dayItineraryRef = collection(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary');
          const querySnapshot = await getDocs(dayItineraryRef);

          // Map through the documents and set card data
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id, // Include the document ID if needed
            ...doc.data() // Spread the document data
          }));

          setCardData(data);
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching itinerary data:', error);
      }
    };

    fetchItineraryData();
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

  // Functions to edit itinerary properties
  const handleEditTitle = () => setIsEditingTitle(prev => !prev);
  const handleEditCountry = () => setIsEditingCountry(prev => !prev);
  const handleEditNumDays = () => setIsEditingNumDays(prev => !prev);
  const handleEditDescription = () => setIsEditingDescription(prev => !prev);


  const handleDeleteItinerary = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this itinerary?');
    if (confirmed) {
      try {
        const user = auth.currentUser;
        if (user) {
          // Function to delete all documents in the dayItinerary sub-collection
          const deleteDayItinerarySubCollection = async (collectionPath) => {
            const dayItineraryRef = collection(db, collectionPath, 'dayItinerary');
            const querySnapshot = await getDocs(dayItineraryRef);
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
          };

          // Delete all documents in the dayItinerary sub-collection for the user's itinerary
          await deleteDayItinerarySubCollection(`users/${user.uid}/itineraries/${itineraryId}`);

          // Optionally delete the dayItinerary sub-collection for the country's itinerary
          await deleteDayItinerarySubCollection(`countries/${country.toLowerCase()}/itineraries/${itineraryId}`);

          // Delete the main itinerary document from the user's itineraries collection
          const userItineraryRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
          await deleteDoc(userItineraryRef);

          // Delete the main itinerary document from the countries collection
          const countryItineraryRef = doc(db, 'countries', country, 'itineraries', itineraryId);
          await deleteDoc(countryItineraryRef);

          // Navigate to another page after deletion
          navigate('/my-itineraries');

          console.log('Itinerary deleted successfully');
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error deleting itinerary:', error);
      }
    }
  };

  const handleEditProperties = () => {
    setProperties((prev) => !prev);
  }

  const handleEditItineraryDetails = () => {
    setEditItineraryDetails((prev) => !prev);
  }

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        if (!(country && numDays && title)) {
          setErrorMessage('Please input required values!');
          setTimeout(() => setErrorMessage(''), 2000);
          return;
        }
        // Reference to the specific day's document
        const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        await updateDoc(dayDocRef, {
          description: description.trim(), // Update the document with the new description
          title: title.trim(),
          country: country,
          days: numDays,
          src: imageURL
        });

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        console.log("country is: " + country);

        const dayCountryDocRef = doc(db, 'countries', country, 'itineraries', itineraryId);
        await updateDoc(dayCountryDocRef, {
          description: description.trim(), // Update the document with the new description
          title: title.trim(),
          country: country,
          days: numDays,
          src: imageURL
        });

        console.log('Document saved successfully');
        setErrorMessage('Saved successfully'); // Clear the error message on successful save
        setTimeout(() => setErrorMessage(''), 2000);
      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error saving description:', error);
      setErrorMessage('Error saving description. Please try again.'); // Set an error message in case of failure
      setTimeout(() => setErrorMessage(''), 2000);
    }
  };

  const handleImageUpload = async () => {
    if (uploading) return; // Prevent multiple uploads

    setUploading(true); // Set uploading status to true

    try {
      const user = auth.currentUser;
      if (user && imageURL) {
        // Reference to the specific day's document
        const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);

        // Example upload logic (You might want to use Firebase Storage for persistent storage)
        await updateDoc(dayDocRef, {
          src: imageURL
        });

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        const country = countryDocSnap.data().country;
        console.log("country is: " + country);

        const dayCountryDocRef = doc(db, 'countries', country, 'itineraries', itineraryId);
        await updateDoc(dayCountryDocRef, {
          src: imageURL
        });

        console.log('Image uploaded successfully');
      } else {
        console.error('User is not authenticated or no image selected');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false); // Reset uploading status
    }
  };

  const handleImageDelete = async () => {
    if (uploading) return; // Prevent multiple deletions

    setUploading(true); // Set uploading status to true

    try {
      const user = auth.currentUser;
      if (user) {
        // Reference to the specific day's document
        const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        
        // Remove image URL from the document
        await updateDoc(dayDocRef, {
          src: '' // Set imageURL to an empty string or null
        });

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        const country = countryDocSnap.data().country;

        const dayCountryDocRef = doc(db, 'countries', country, 'itineraries', itineraryId);
        await updateDoc(dayCountryDocRef, {
          src: '' // Set imageURL to an empty string or null
        });

        // Reset state after successful deletion
        setImage(null);
        setImageURL('');

        console.log('Image deleted successfully');
      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setUploading(false); // Reset uploading status
    }
  };

  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(file);
          setImageURL(reader.result); // Set the imageURL state
        };
        reader.readAsDataURL(file);
      } else {
        console.error('No file selected.');
      }
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  // const handleNumDaysChange = async () => {

  // }

  // const handleCountryChange = async () => {

  // };

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

        <div className='bubble-container'>
          <div className='bubble-1'>
            <OvalDropDownButton onClick={handleEditProperties}>Edit Properties</OvalDropDownButton>
            <div>
              {properties ? (
                <div className='title-and-info'>

                {/* Title Section */}
                <div className='title-section'>
                  <h4 className='itinerary-title'>Title: </h4>
                  {isEditingTitle ? (
                    <>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={40}
                      />
                      <Button onClick={() => setIsEditingTitle(false)}>OK</Button>
                    </>
                  ) : (
                    <>
                      <div className='details'>{title}</div>
                      <Button className='edit-button' onClick={() => setIsEditingTitle(true)}>Edit</Button>
                    </>
                  )}
                </div>
              
                {/* Country Section */}
                <div className='country-section'>
                  <h4 className='itinerary-country'>Country: </h4>
                    <div className='details'>{country}</div>
                    <Button className='edit-button' onClick={() => setIsEditingCountry(true)}>Edit</Button>
                </div>
              
                {/* Number of Days Section */}
                <div className='duration-section'>
                  <h4 className='itinerary-duration'>Number of days: </h4>
                  <div className='details'>{numDays}</div>
                  <Button className='edit-button' onClick={() => setIsEditingNumDays(true)}>Edit</Button>
                </div>
              
                {/* Description Section */}
                <div className='description-section'>
                  <h4 className='itinerary-description'>Description: </h4>
                  {isEditingDescription ? (
                    <>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                      />
                      <Button onClick={() => setIsEditingDescription(false)}>OK</Button>
                    </>
                  ) : (
                    <>
                      <div className='details'>{description}</div>
                      <Button className='edit-button' onClick={() => setIsEditingDescription(true)}>Edit</Button>
                    </>
                  )}
                </div>

                {/* Itinerary Image Section */}
                <div className='image-section'>
                  <h4 className='itinerary-image'>Itinerary Image: </h4>
                  <div className='uploaded-image-preview'>
                    <img src={imageURL} alt="Day Image" className='uploaded-image' />
                  </div>
                  <div className='image-buttons-div'>
                    <>
                      <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        onClick={handleButtonClick}
                        disabled={uploading} // Disable button while uploading
                      >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </Button>
                      {imageURL && (
                      <>
                      <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={handleImageDelete}
                        disabled={uploading} // Disable button while uploading
                      >
                        {uploading ? 'Deleting...' : 'Delete Image'}
                      </Button>
                      </>
                  )}
                    </>
                  </div>
                </div>

                <div className='save-button-section'>
                  <OvalDropDownButton className='save-button' onClick={handleSave}>Save</OvalDropDownButton>
                  {errorMessage && <div>{errorMessage}</div>} {/* Conditionally render the error message */}
                </div>
              </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div className='bubble-2'>
            <OvalDropDownButton onClick={handleEditItineraryDetails}>Edit Itinerary Details</OvalDropDownButton>
            <div>
              {editItineraryDetails ? (
                <div className='render-button-list'>
                  {cardData.map(card => (
                    <ItineraryCardDay
                      key={card.day}
                      itineraryId={itineraryId}
                      src={card.src}
                      title={card.title}
                      summary={card.summary}
                      day={card.day}
                    />
                  ))}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div className='bubble-3'>
            <OvalDropDownButton className='delete-button' onClick={handleDeleteItinerary}>Delete Itinerary</OvalDropDownButton>
          </div>
        </div>



      </div>

  )
}

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

export default CreateItineraryDetails