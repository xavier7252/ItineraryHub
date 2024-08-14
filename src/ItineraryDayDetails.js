import Banner from './Banner';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from "@mui/material/IconButton";
import DestinationCard from './DestinationCard';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from './firebase/FirebaseConfig';
import countries from './data/Countries';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import countriesArray from './data/ArrayOfCountries';
import { List, ListItem, ListItemText } from '@mui/material';
import GooglePlacesSearch from './GooglePlacesSearch';
import { Loader } from "@googlemaps/js-api-loader"
import GoogleMaps from './GoogleMaps';
import './ItineraryDayDetails.css'
import GooglePlacesAndMaps from './GooglePlacesAndMaps';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection, onSnapshot } from 'firebase/firestore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import placeholderImage from './SampleImages/placeholder-image.jpg'
import { OvalDropDownButton } from './Tools/OvalDropDownButton';

const ItineraryDayDetails = () => {

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
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [uploading, setUploading] = useState(false); // To track uploading status
  const [properties, setProperties] = useState(false);
  const [googleMaps, setGoogleMaps] = useState(false);

  const { itineraryId } = useParams();

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
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocId = day.toString().padStart(2, '0');
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
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
  }, [itineraryId, day]);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocId = day.toString().padStart(2, '0');
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            setTitle(dayDoc.data().title || ''); // Set the existing description
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching description:', error);
      }
    };

    fetchTitle();
  }, [itineraryId, day]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocId = day.toString().padStart(2, '0');
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            setSummary(dayDoc.data().summary || ''); // Set the existing summary
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, [itineraryId, day]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocId = day.toString().padStart(2, '0');
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
          const dayDoc = await getDoc(dayDocRef);
          if (dayDoc.exists()) {
            setLocations(dayDoc.data().locations || []);
          } else {
            console.error('Itinerary not found');
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [itineraryId, day]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const dayDocId = day.toString().padStart(2, '0');
          const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
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
  }, [itineraryId, day]);

  useEffect(() => {
    const uploadImage = async () => {
      if (imageURL) {
        await handleImageUpload();
      }
    };
  
    uploadImage();
  }, [imageURL]); // Dependency array includes imageURL
  

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

  const handleImageUpload = async () => {
    if (uploading) return; // Prevent multiple uploads

    setUploading(true); // Set uploading status to true

    try {
      const user = auth.currentUser;
      if (user && imageURL) {
        // Reference to the specific day's document
        const dayDocId = day.toString().padStart(2, '0');
        const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
  
        // Example upload logic (You might want to use Firebase Storage for persistent storage)
        await updateDoc(dayDocRef, {
          src: imageURL
        });

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        const country = countryDocSnap.data().country;
        console.log("country is: " + country);
        
        const dayCountryDocRef = doc(db, 'countries', country, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
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
        const dayDocId = day.toString().padStart(2, '0');
        const dayDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        
        // Remove image URL from the document
        await updateDoc(dayDocRef, {
          src: '' // Set imageURL to an empty string or null
        });

        const countryDocRef = doc(db, 'users', user.uid, 'itineraries', itineraryId);
        const countryDocSnap = await getDoc(countryDocRef);
        const country = countryDocSnap.data().country;

        const dayCountryDocRef = doc(db, 'countries', country, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        await updateDoc(dayCountryDocRef, {
          src: '' // Set imageURL to an empty string or null
        });

        // Reset state after successful deletion
        setImage(null);
        setImageURL(placeholderImage);

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

  const handleEditProperties = () => {
    setProperties((prev) => !prev);
  }

  const handleEditGoogleMaps = () => {
    setGoogleMaps((prev) => !prev);
  }

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

      <div className='bubble-container'>
          <div className='bubble-1'>
            <OvalDropDownButton onClick={handleEditProperties}>Edit Itinerary Details</OvalDropDownButton>
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
              
                {/* Description Section */}
                <div className='summary-section'>
                  <h4 className='itinerary-summary'>Summary: </h4>
                  {isEditingSummary ? (
                    <>
                      <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        maxLength={85}
                      />
                      <Button onClick={() => setIsEditingSummary(false)}>OK</Button>
                    </>
                  ) : (
                    <>
                      <div className='details'>{summary}</div>
                      <Button className='edit-button' onClick={() => setIsEditingSummary(true)}>Edit</Button>
                    </>
                  )}
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
            <OvalDropDownButton onClick={handleEditGoogleMaps}>Add Locations</OvalDropDownButton>          
            <div>
              {googleMaps ? (
                <div className='google-maps'>
                  {/* <h4 className='add-places'>Add Places</h4> */}
                  <div >
                    <GooglePlacesAndMaps itineraryId={itineraryId} />
                  </div>
                </div>
               
              ) : (
                <div></div>
              )}
            </div>
          </div>

        </div>

        <div className='itinerary-day-details-card-container'>

          <div className='list-of-places'>
            <h4>Places added (Max: 15)</h4>
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
                  <Button
                    className='delete-button'
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering the openInGoogleMaps function when clicking the delete button
                      handleDeleteLocation(index);
                    }}
                  >Delete</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  )

};

export default ItineraryDayDetails;
