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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
  } catch (err) {
    console.error('Auto-seed warning:', err.message);
  }
};

const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  await autoSeed();
  app.listen(PORT, () => console.log(`GlobeTrotter API running on port ${PORT}`));
};

start();
