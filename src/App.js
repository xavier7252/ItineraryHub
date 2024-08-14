// App.js
import React, { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/FirebaseConfig';
import Home from './Home'; // Import Home component
import France from './CountryPages/France';
import Italy from './CountryPages/Italy';
import Profile from './Profile';
import MyItineraries from './MyItineraries';
import CreateItinerary from './CreateItinerary';
import CreateItineraryDetails from './CreateItineraryDetails';
import ItineraryDayDetails from './ItineraryDayDetails';
import CountryItineraryDetails from './CountryPages/CountryItineraryDetails';
import CountryItineraryDayDetails from './CountryPages/CountryItineraryDayDetails';
import CountryPageGenerator from './CountryPages/CountryPageGenerator';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' exact element={<Home />} />
          {/* <Route path="/country/france" element={<France />} />
          <Route path="/country/italy" element={<Italy />} /> */}
          <Route path="/country/:countryLabel/" element={<CountryPageGenerator />} />
          <Route path="/country/:countryLabel/:itineraryId" element={<CountryItineraryDetails />} />
          <Route path="/country/:countryLabel/:itineraryId/:day" element={<CountryItineraryDayDetails />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Home />} />
          <Route path="/my-itineraries" element={isLoggedIn ? <MyItineraries /> : <Home />} />
          <Route path="/my-itineraries/:itineraryId" element={isLoggedIn ? <CreateItineraryDetails /> : <Home />} />
          <Route path="/create-itinerary" element={isLoggedIn ? <CreateItinerary /> : <Home />} />
          {/* <Route path="/create-itinerary-details/:itineraryId" element={isLoggedIn ? <CreateItineraryDetails /> : <Home />} /> */}
          <Route path="/create-itinerary-details/:itineraryId/:day" element={isLoggedIn ? <ItineraryDayDetails /> : <Home />} />

          {/* Add routes for other countries similarly */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
