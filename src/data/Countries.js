const countries = [
  {
    name: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'Explore the romantic streets of Paris and the beautiful French countryside!',
    destinationsLink: '/destinations/france',
  },
  {
    name: 'Italy',
    image: 'https://www.usatoday.com/gcdn/-mm-/6cb0566daad6b8973e2c456e7a61df50f54939b5/c=0-117-1408-1994/local/-/media/2017/01/04/USATODAY/USATODAY/636191149244091355-GettyImages-537365893.jpg?width=660&height=880&fit=crop&format=pjpg&auto=webp',
    description: 'Discover the art, history, and delicious cuisine of Italy!',
    destinationsLink: '/destinations/italy',
  },
  {
    name: 'Spain',
    image: 'https://media.cntraveler.com/photos/5b2d15c98b842c3b35c5d3c7/1:1/w_2667,h_2667,c_limit/Madrid-Beaches_GettyImages-731843465.jpg',
    description: 'Enjoy the vibrant culture, stunning beaches, and delicious tapas of Spain!',
    destinationsLink: '/destinations/spain',
  },
  {
    name: 'Japan',
    image: 'https://www.state.gov/wp-content/uploads/2019/04/Japan-2107x1406.jpg',
    description: 'Experience the blend of ancient traditions and cutting-edge technology in Japan!',
    destinationsLink: '/destinations/japan',
  },
  {
    name: 'Australia',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Sydney_Australia._%2821339175489%29.jpg',
    description: 'Discover the stunning landscapes, unique wildlife, and vibrant cities of Australia!',
    destinationsLink: '/destinations/australia',
  },
  {
    name: 'United States',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Front_view_of_Statue_of_Liberty_with_pedestal_and_base_2024.jpg/1200px-Front_view_of_Statue_of_Liberty_with_pedestal_and_base_2024.jpg',
    description: 'Visit iconic landmarks, explore diverse cities, and enjoy natural wonders in the USA!',
    destinationsLink: '/destinations/usa',
  },
  {
    name: 'Canada',
    image: 'https://travel.usnews.com/images/Niagara_Falls_new_original_Getty_zN15Poa.jpg',
    description: 'Explore stunning natural beauty, vibrant cities, and friendly locals in Canada!',
    destinationsLink: '/destinations/canada',
  },
  {
    name: 'United Kingdom',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Elizabeth_Tower%2C_June_2022.jpg',
    description: 'Visit historic landmarks, explore vibrant cities, and enjoy traditional British culture!',
    destinationsLink: '/destinations/uk',
  },
  {
    name: 'Germany',
    image: 'https://cdn.prod.website-files.com/62fc39d4a8950f2d6f3b35f6/6343df59459eb42a7d0053be_The%20Top%2010%20Most%20Popular%20Tourist%20Attractions%20in%20Germany.webp',
    description: 'Discover rich history, modern architecture, and vibrant cultural scenes in Germany!',
    destinationsLink: '/destinations/germany',
  },
  {
    name: 'Netherlands',
    image: 'https://www.planetware.com/wpimages/2021/12/netherlands-top-rated-attractions-jordaan-amsterdams-canals.jpg',
    description: 'Visit picturesque canals, historic windmills, and vibrant cities in the Netherlands!',
    destinationsLink: '/destinations/netherlands',
  },
  {
    name: 'Switzerland',
    image: 'https://www.planetware.com/wpimages/2020/02/best-time-to-visit-switzerland-best-time-of-year-to-visit.jpg',
    description: 'Explore breathtaking Alps, pristine lakes, and charming cities in Switzerland!',
    destinationsLink: '/destinations/switzerland',
  },
  {
    name: 'Singapore',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Marina_Bay_Sands_in_the_evening_-_20101120.jpg',
    description: 'Experience modern architecture, diverse cuisine, and vibrant culture in Singapore!',
    destinationsLink: '/destinations/singapore',
  },
  {
    name: 'South Korea',
    image: 'https://www.agoda.com/wp-content/uploads/2018/10/Experience-Seoul_attractions_Gyeongbokgung-Palace.jpg',
    description: 'Discover ancient palaces, vibrant street food scenes, and modern technology in South Korea!',
    destinationsLink: '/destinations/south-korea',
  },
  {
    name: 'Austria',
    image: 'https://www.planetware.com/photos-large/A/austria-dachstein-salzkammergut-giant-ice-cave.jpg',
    description: 'Explore imperial palaces, cultural events, and Alpine landscapes in Austria!',
    destinationsLink: '/destinations/austria',
  },
  {
    name: 'New Zealand',
    image: 'https://cdn-v2.theculturetrip.com/1200x675/wp-content/uploads/2020/09/queenstown-gondola-new-zealand-e1599145794988.webp',
    description: 'Discover breathtaking landscapes, outdoor adventures, and Maori culture in New Zealand!',
    destinationsLink: '/destinations/new-zealand',
  },
  {
    name: 'Norway',
    image: 'https://www.planetware.com/photos-large/N/norway-attractions-sognefjord.jpg',
    description: 'Experience fjords, Northern Lights, and modern Scandinavian culture in Norway!',
    destinationsLink: '/destinations/norway',
  },
  {
    name: 'Belgium',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Brussels_-_Atomium_2022.jpg/1200px-Brussels_-_Atomium_2022.jpg',
    description: 'Explore medieval towns, delicious chocolates, and historic architecture in Belgium!',
    destinationsLink: '/destinations/belgium',
  },
  {
    name: 'Denmark',
    image: 'https://img.traveltriangle.com/blog/wp-content/uploads/2019/03/Nyhavn-pier-Denmark.jpg',
    description: 'Visit charming Copenhagen, historic castles, and vibrant cultural scenes in Denmark!',
    destinationsLink: '/destinations/denmark',
  },
  {
    name: 'Sweden',
    image: 'https://visitsweden.com/_next/image/?url=https%3A%2F%2Fs3-eu-north-1.amazonaws.com%3A443%2Fpy3.visitsweden.com%2Foriginal_images%2FOrebro-CMSTemplate_lUACv15.jpg&w=1980&q=60',
    description: 'Discover picturesque archipelagos, vibrant cities, and innovative design in Sweden!',
    destinationsLink: '/destinations/sweden',
  },
  {
    name: 'Finland',
    image: 'https://images.ctfassets.net/i3kf1olze1gn/6LRHNBotnTrbrpEdXMf6JY/20a555b7f717a562fc7ff5f73655a910/maria-vojtovicova-SPvJPDXEmqA-unsplash.jpg',
    description: 'Experience stunning natural beauty, modern architecture, and unique culture in Finland!',
    destinationsLink: '/destinations/finland',
  }
];

export default countries;
