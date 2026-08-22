const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const { User, City, Activity, PointOfInterest, Favorite, Review } = require('../models');
const ensureSchema = require('../utils/ensureSchema');
require('dotenv').config();

const cities = [
  { name: 'Paris', country: 'France', cost_index: 78, popularity: 95, description: 'City of Light, art, and iconic landmarks.', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { name: 'Tokyo', country: 'Japan', cost_index: 72, popularity: 92, description: 'Ultra-modern meets traditional culture.', image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { name: 'New York', country: 'USA', cost_index: 85, popularity: 90, description: 'The city that never sleeps.', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600' },
  { name: 'Bali', country: 'Indonesia', cost_index: 40, popularity: 88, description: 'Tropical paradise with rich culture.', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
  { name: 'Rome', country: 'Italy', cost_index: 65, popularity: 89, description: 'Ancient history around every corner.', image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
  { name: 'Dubai', country: 'UAE', cost_index: 80, popularity: 84, description: 'Futuristic skyline and luxury experiences.', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' },
  { name: 'Barcelona', country: 'Spain', cost_index: 60, popularity: 86, description: 'Gaudi architecture and Mediterranean beaches.', image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600' },
  { name: 'Bangkok', country: 'Thailand', cost_index: 35, popularity: 83, description: 'Vibrant street life and temples.', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600' },
  { name: 'Jaipur', country: 'India', cost_index: 32, popularity: 87, description: 'Historic forts, palaces, and colorful bazaars.', image_url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600' },
  { name: 'Goa', country: 'India', cost_index: 38, popularity: 82, description: 'Coastal beaches, Portuguese heritage, and relaxed food culture.', image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600' },
  { name: 'Manali', country: 'India', cost_index: 30, popularity: 78, description: 'Mountain valleys, hiking trails, and family-friendly escapes.', image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600' },
  { name: 'Rishikesh', country: 'India', cost_index: 28, popularity: 76, description: 'River landscapes, yoga, temples, and outdoor adventures.', image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600' },
  { name: 'Udaipur', country: 'India', cost_index: 35, popularity: 80, description: 'Lakeside palaces, historic streets, and quiet cultural experiences.', image_url: 'https://images.unsplash.com/photo-1582972236019-ea9e2f7a2c6c?w=600' },
  { name: 'Kerala', country: 'India', cost_index: 42, popularity: 85, description: 'Backwaters, tropical landscapes, and regional cuisine.', image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600' },
  { name: 'New Delhi', country: 'India', cost_index: 36, popularity: 84, description: 'National monuments, museums, markets, and diverse food traditions.', image_url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600' },
  { name: 'Singapore', country: 'Singapore', cost_index: 76, popularity: 88, description: 'Efficient urban travel, gardens, waterfronts, and hawker cuisine.', image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600' }
];

const activityTemplates = [
  { name: 'City Walking Tour', category: 'sightseeing', cost: 20, duration_hours: 3 },
  { name: 'Local Food Tasting', category: 'food', cost: 35, duration_hours: 2 },
  { name: 'Museum Visit', category: 'sightseeing', cost: 15, duration_hours: 2.5 },
  { name: 'Adventure Sports', category: 'adventure', cost: 60, duration_hours: 4 },
  { name: 'Airport Transfer', category: 'transport', cost: 25, duration_hours: 1 },
  { name: 'Boutique Hotel Stay (per night)', category: 'stay', cost: 90, duration_hours: 24 },
  { name: 'Sunset Cruise', category: 'adventure', cost: 45, duration_hours: 2 },
  { name: 'Fine Dining Experience', category: 'food', cost: 70, duration_hours: 2 }
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await ensureSchema();
    if (sequelize.getDialect() === 'sqlite') {
      const columns = await sequelize.query('PRAGMA table_info(points_of_interest)');
      if (!columns[0].some(column => column.name === 'price')) await sequelize.query('ALTER TABLE points_of_interest ADD COLUMN price DECIMAL(10,2)');
    }

    // Admin user
    const adminExists = await User.findOne({ where: { email: 'admin@globetrotter.com' } });
    if (!adminExists) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      await User.create({
        first_name: 'Admin', last_name: 'User', email: 'admin@globetrotter.com',
        password: hashed, role: 'admin', city: 'Ahmedabad', country: 'India'
      });
      console.log('Admin user created: admin@globetrotter.com / Admin@123');
    }

    // Demo user
    const demoExists = await User.findOne({ where: { email: 'demo@globetrotter.com' } });
    if (!demoExists) {
      const hashed = await bcrypt.hash('Demo@123', 10);
      await User.create({
        first_name: 'Demo', last_name: 'Traveler', email: 'demo@globetrotter.com',
        password: hashed, role: 'user', city: 'Ahmedabad', country: 'India'
      });
      console.log('Demo user created: demo@globetrotter.com / Demo@123');
    }

    for (const c of cities) {
      const [city] = await City.findOrCreate({ where: { name: c.name, country: c.country }, defaults: c });
      const metadata = {
        tags: c.name === 'Jaipur' || c.name === 'Rome' ? 'historical,cultural,family,budget' : c.name === 'Goa' || c.name === 'Bali' ? 'beach,couple,nature,food' : c.name === 'Rishikesh' || c.name === 'Manali' ? 'adventure,nature,spiritual,family' : c.name === 'Bangkok' || c.name === 'Tokyo' ? 'food,temple,cultural,adventure' : 'cultural,food,popular',
        rating: Math.min(4.9, 3.8 + (c.popularity / 100)),
        family_friendly: ['Jaipur', 'Manali', 'Singapore', 'Bangkok', 'New Delhi'].includes(c.name),
        couple_friendly: ['Goa', 'Bali', 'Paris', 'Udaipur', 'Rome'].includes(c.name),
        child_friendly: ['Singapore', 'Paris', 'Tokyo', 'Manali', 'Jaipur'].includes(c.name),
        recommended_duration: ['Paris', 'Tokyo', 'Rome', 'New York'].includes(c.name) ? 5 : 3
        ,travel_tip: c.name === 'Rishikesh' ? 'Carry water and comfortable walking shoes for riverside and temple visits.' : c.name === 'Manali' ? 'Pack warm layers and check mountain road conditions before day trips.' : 'Start sightseeing early and carry comfortable walking shoes.'
      };
      await city.update(metadata);
      const existingActivities = await Activity.count({ where: { city_id: city.id } });
      if (existingActivities === 0) {
        for (const t of activityTemplates) {
          await Activity.create({
            city_id: city.id,
            name: `${t.name} - ${c.name}`,
            category: t.category,
            cost: t.cost + Math.round((c.cost_index / 10)),
            duration_hours: t.duration_hours,
            description: `${t.name} experience in ${c.name}, ${c.country}.`,
            image_url: c.image_url
          });
        }
      }
      if (await PointOfInterest.count({ where: { city_id: city.id } }) === 0) {
        await PointOfInterest.bulkCreate([
          { city_id: city.id, type: 'hotel', name: `${c.name} Garden Stay`, description: 'Seeded demo accommodation record for application testing.', price: 1800 + (c.cost_index * 45), price_tier: c.cost_index > 60 ? 'Premium' : 'Budget', rating: 4.3, distance_km: 2.4, amenities: 'Breakfast, Wi-Fi', image_url: c.image_url },
          { city_id: city.id, type: 'restaurant', name: `${c.name} Local Table`, description: 'Seeded demo restaurant record featuring local cuisine.', price: 700 + (c.cost_index * 18), price_tier: c.cost_index > 60 ? 'Premium' : 'Moderate', rating: 4.4, distance_km: 1.8, amenities: 'Local food, Vegetarian options', image_url: c.image_url },
          { city_id: city.id, type: 'transport', name: `${c.name} Central Transfer`, description: 'Seeded informational transport option. Availability is not live.', price: 120 + (c.cost_index * 4), price_tier: 'Information', rating: 4.0, distance_km: 5.2, amenities: 'Airport, Railway, Taxi', image_url: c.image_url }
        ]);
      }
      const points = await PointOfInterest.findAll({ where: { city_id: city.id } });
      for (const point of points) {
        const price = point.type === 'hotel' ? 1800 + (c.cost_index * 45) : point.type === 'restaurant' ? 700 + (c.cost_index * 18) : 120 + (c.cost_index * 4);
        await point.update({ price });
      }
    }

    const demoUser = await User.findOne({ where: { email: 'demo@globetrotter.com' } });
    const featuredCity = await City.findOne({ where: { name: 'Jaipur' } });
    if (demoUser && featuredCity) {
      await Favorite.findOrCreate({ where: { user_id: demoUser.id, entity_type: 'city', entity_id: featuredCity.id } });
      await Review.findOrCreate({ where: { user_id: demoUser.id, entity_type: 'city', entity_id: featuredCity.id }, defaults: { rating: 5, comment: 'A seeded demo review for the destination detail flow.' } });
    }

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
