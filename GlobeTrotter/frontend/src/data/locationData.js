export const locationData = {
  "India": {
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi", "Davangere"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer", "Bikaner"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
  },
  "United States": {
    "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno"],
    "New York": ["New York City", "Buffalo", "Rochester", "Syracuse", "Albany"],
    "Texas": ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth", "El Paso"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
    "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Springfield"]
  },
  "United Kingdom": {
    "England": ["London", "Manchester", "Birmingham", "Liverpool", "Bristol", "Leeds", "Oxford"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    "Wales": ["Cardiff", "Swansea", "Newport", "Bangor"],
    "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry"]
  },
  "Canada": {
    "Ontario": ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London", "Brampton"],
    "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Sherbrooke"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Kelowna"],
    "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge"]
  },
  "Australia": {
    "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast"],
    "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo"],
    "Queensland": ["Brisbane", "Gold Coast", "Cairns", "Townsville"],
    "Western Australia": ["Perth", "Mandurah", "Bunbury"]
  },
  "Germany": {
    "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg"],
    "Berlin": ["Berlin"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Bonn"],
    "Hesse": ["Frankfurt", "Wiesbaden", "Kassel", "Darmstadt"]
  },
  "France": {
    "Île-de-France": ["Paris", "Boulogne-Billancourt", "Versailles", "Saint-Denis"],
    "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Cannes", "Aix-en-Provence"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne", "Annecy"]
  },
  "Japan": {
    "Tokyo": ["Tokyo", "Shinjuku", "Shibuya", "Ginza"],
    "Osaka": ["Osaka", "Sakai", "Higashiosaka"],
    "Kyoto": ["Kyoto", "Uji", "Kameoka"],
    "Kanagawa": ["Yokohama", "Kawasaki", "Kamakura"]
  },
  "United Arab Emirates": {
    "Dubai": ["Dubai City", "Jumeirah", "Deira", "Downtown Dubai"],
    "Abu Dhabi": ["Abu Dhabi City", "Al Ain", "Ruwais"],
    "Sharjah": ["Sharjah City", "Khor Fakkan"]
  }
}

export const getCountries = () => Object.keys(locationData)

export const getStates = (country) => {
  if (!country || !locationData[country]) return []
  return Object.keys(locationData[country])
}

export const getCities = (country, state) => {
  if (!country || !state || !locationData[country] || !locationData[country][state]) return []
  return locationData[country][state]
}
