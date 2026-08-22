const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const { User, City, Activity } = require('../models');
require('dotenv').config();

const cities = [
  { name: 'Paris', country: 'France', cost_index: 78, popularity: 95, description: 'City of Light, art, and iconic landmarks.', image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600' },
  { name: 'Tokyo', country: 'Japan', cost_index: 72, popularity: 92, description: 'Ultra-modern meets traditional culture.', image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
  { name: 'New York', country: 'USA', cost_index: 85, popularity: 90, description: 'The city that never sleeps.', image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600' },
  { name: 'Bali', country: 'Indonesia', cost_index: 40, popularity: 88, description: 'Tropical paradise with rich culture.', image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600' },
  { name: 'Rome', country: 'Italy', cost_index: 65, popularity: 89, description: 'Ancient history around every corner.', image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600' },
  { name: 'Dubai', country: 'UAE', cost_index: 80, popularity: 84, description: 'Futuristic skyline and luxury experiences.', image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600' },
  { name: 'Barcelona', country: 'Spain', cost_index: 60, popularity: 86, description: 'Gaudi architecture and Mediterranean beaches.', image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600' },
  { name: 'Bangkok', country: 'Thailand', cost_index: 35, popularity: 83, description: 'Vibrant street life and temples.', image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600' }
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
    }

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
