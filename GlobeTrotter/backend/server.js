const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, connectDB } = require('./config/db');
require('./models'); // registers associations
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const cityRoutes = require('./routes/cityRoutes');
const activityRoutes = require('./routes/activityRoutes');
const communityRoutes = require('./routes/communityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/health', (req, res) => res.json({ status: 'GlobeTrotter API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const bcrypt = require('bcryptjs');
const { User, City, Activity } = require('./models');

const autoSeed = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@globetrotter.com' } });
    if (!adminExists) {
      const hashed = await bcrypt.hash('Admin@123', 10);
      await User.create({
        first_name: 'Admin', last_name: 'User', email: 'admin@globetrotter.com',
        password: hashed, role: 'admin', city: 'Ahmedabad', country: 'India'
      });
      console.log('Auto-seeded Admin user: admin@globetrotter.com / Admin@123');
    }

    const demoExists = await User.findOne({ where: { email: 'demo@globetrotter.com' } });
    if (!demoExists) {
      const hashed = await bcrypt.hash('Demo@123', 10);
      await User.create({
        first_name: 'Demo', last_name: 'Traveler', email: 'demo@globetrotter.com',
        password: hashed, role: 'user', city: 'Ahmedabad', country: 'India'
      });
      console.log('Auto-seeded Demo user: demo@globetrotter.com / Demo@123');
    }

    const citiesCount = await City.count();
    if (citiesCount === 0) {
      console.log('Seeding default cities and activities...');
      const seedData = [
        {
          name: 'Paris', country: 'France', cost_index: 85, popularity: 95,
          description: 'The City of Light, famed for Eiffel Tower, haute couture, Louvre museum, and romantic cafes.',
          activities: [
            { name: 'Eiffel Tower Access & Summit', category: 'sightseeing', cost: 45, duration_hours: 3, description: 'Skip-the-line access to Eiffel Tower with summit view.' },
            { name: 'Louvre Guided Tour', category: 'sightseeing', cost: 65, duration_hours: 4, description: 'Guided tour of Louvre Museum including Mona Lisa and Venus de Milo.' },
            { name: 'French Croissant Baking Class', category: 'food', cost: 55, duration_hours: 2, description: 'Learn to bake authentic French pastries with a Parisian chef.' },
            { name: 'Seine River Evening Cruise', category: 'adventure', cost: 25, duration_hours: 1.5, description: 'Glass-canopy boat cruise with audio guide along the Seine river.' },
            { name: 'Classic Boutique Stay', category: 'stay', cost: 150, duration_hours: 24, description: 'Boutique stay in Saint-Germain-des-Prés.' }
          ]
        },
        {
          name: 'Tokyo', country: 'Japan', cost_index: 80, popularity: 98,
          description: 'A neon-lit futuristic metropolis blending ancient shrines, high-tech gadgets, and Michelin-star sushi.',
          activities: [
            { name: 'Senso-ji Temple & Asakusa Tour', category: 'sightseeing', cost: 15, duration_hours: 2.5, description: 'Historical walking tour through Tokyo\'s oldest Buddhist temple.' },
            { name: 'Shibuya Crossing & Izakaya Crawl', category: 'food', cost: 70, duration_hours: 3.5, description: 'Tour the famous crossing followed by dynamic local street eats and drinks.' },
            { name: 'Mount Fuji Day Hike', category: 'adventure', cost: 110, duration_hours: 10, description: 'Guided day trip hike up to Mt. Fuji 5th station.' },
            { name: 'Capsule Hotel Experience', category: 'stay', cost: 40, duration_hours: 24, description: 'Unique minimalist capsule hotel stay in Shinjuku.' }
          ]
        },
        {
          name: 'Rome', country: 'Italy', cost_index: 70, popularity: 92,
          description: 'The Eternal City boasts nearly 3,000 years of globally influential art, architecture, and culture.',
          activities: [
            { name: 'Colosseum & Roman Forum Pass', category: 'sightseeing', cost: 35, duration_hours: 3, description: 'Fast-track access ticket to the legendary ancient amphitheater.' },
            { name: 'Vatican Museums & Sistine Chapel', category: 'sightseeing', cost: 50, duration_hours: 4, description: 'Explore Michelangelo\'s masterpiece with skip-the-line pass.' },
            { name: 'Handmade Pizza & Pasta Class', category: 'food', cost: 60, duration_hours: 3, description: 'Cook pizza and fresh pasta with local Roman chefs.' }
          ]
        },
        {
          name: 'Ahmedabad', country: 'India', cost_index: 30, popularity: 75,
          description: 'India\'s first UNESCO World Heritage City, famous for Sabarmati Ashram, intricate carvings, and delicious street food.',
          activities: [
            { name: 'Sabarmati Ashram Visit', category: 'sightseeing', cost: 2, duration_hours: 2, description: 'Learn about Mahatma Gandhi\'s life and the Indian independence movement.' },
            { name: 'Heritage Heritage Walk', category: 'sightseeing', cost: 5, duration_hours: 3, description: 'Walk through the historical pols of the old city.' },
            { name: 'Authentic Gujarati Thali Dinner', category: 'food', cost: 12, duration_hours: 2, description: 'Full grand spread of traditional Gujarati vegetarian delicacies.' }
          ]
        }
      ];

      for (const item of seedData) {
        const { activities, ...cityInfo } = item;
        const city = await City.create(cityInfo);
        for (const act of activities) {
          await Activity.create({ ...act, city_id: city.id });
        }
      }
      console.log('Successfully seeded cities and activities!');
    }
  } catch (err) {
    console.error('Auto-seed warning:', err.message);
  }
};

const start = async () => {
  await connectDB();
  await sequelize.sync();
  await autoSeed();
  app.listen(PORT, () => console.log(`GlobeTrotter API running on port ${PORT}`));
};

start();
