import { db, auth } from './firebase/FirebaseConfig'; // Adjust the path as needed
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import placeholderImage from './SampleImages/placeholder-image.jpg'

// Export the addItinerary function
export const addItinerary = async (country, days, title, description) => {
  try {
    const user = auth.currentUser;
    if (user) {

      // Add itinerary to user's itinerary collection
      const userItinerariesRef = collection(db, 'users', user.uid, 'itineraries');
      const daysCount = parseInt(days, 10); // Convert to an integer
      console.log('dayscountis:', daysCount)
      const newItineraryRef = await addDoc(userItinerariesRef, {
        country: country.toLowerCase(),
        days: days,
        title: title,
        description: description,
        src: placeholderImage,
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        // locations: [] // Initialize with an empty array
      });

      const itineraryId = newItineraryRef.id;

      // Create a sub-collection for each day in the itinerary with specific document IDs
      for (let day = 1; day <= daysCount; day++) {
        const dayDocId = day.toString().padStart(2, '0');
        const dayItineraryRef = doc(db, 'users', user.uid, 'itineraries', newItineraryRef.id, 'dayItinerary', dayDocId);
        await setDoc(dayItineraryRef, {
          day: day,
          description: 'description',
          summary: 'Summary',
          src: placeholderImage,
          title: `Day ${day}`,
          locations: [] // Initialize with an empty array
        });
      }

      // Add the itinerary to the country-specific collection
      const countryLabel = country.toLowerCase();
      console.log(countryLabel)
      const countryItineraryRef = collection(db, 'countries', countryLabel, 'itineraries');
      const newCountryItineraryRef = await setDoc(doc(countryItineraryRef, itineraryId), {
        country: countryLabel.toLowerCase(),
        days: days,
        title: title,
        description: description,
        src: placeholderImage,
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create a sub-collection for each day in the itinerary with specific document IDs
      for (let day = 1; day <= daysCount; day++) {
        const dayDocId = day.toString().padStart(2, '0');
        const dayItineraryRef = doc(db, 'countries', countryLabel, 'itineraries', itineraryId, 'dayItinerary', dayDocId);
        await setDoc(dayItineraryRef, {
          day: day,
          description: 'description',
          summary: 'Summary',
          src: placeholderImage,
          title: `Day ${day}`,
          locations: [] // Initialize with an empty array
        });
      }

      console.log('Itinerary added with ID:', newItineraryRef.id);
      return newItineraryRef.id; // Return the document ID
    } else {
      console.error('No user is currently signed in.');
      return null;
    }
  } catch (e) {
    console.error('Error adding itinerary: ', e);
    return null;
  }
};
