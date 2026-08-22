const { v4: uuidv4 } = require('uuid');
const { Trip, Stop, StopActivity, City, Activity, User } = require('../models');

const fullTripInclude = [
  {
    model: Stop,
    include: [
      { model: City },
      { model: StopActivity, include: [{ model: Activity }] }
    ]
  }
];

// @desc Create a new trip
// @route POST /api/trips
const createTrip = async (req, res) => {
  try {
    const { name, description, start_date, end_date, cover_photo, is_public } = req.body;
    if (!name || String(name).trim() === '' || !start_date || !end_date) {
      return res.status(400).json({ message: 'Trip name, start date, and end date are required' });
    }
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ message: 'End date must be greater than or equal to start date' });
    }
    const trip = await Trip.create({
      user_id: req.user.id, name: String(name).trim(), description, start_date, end_date,
      cover_photo, is_public: !!is_public, share_token: uuidv4()
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc List all trips for logged-in user, grouped by status
// @route GET /api/trips
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { user_id: req.user.id },
      include: fullTripInclude,
      order: [['start_date', 'ASC']]
    });

    const today = new Date().toISOString().slice(0, 10);
    const grouped = { ongoing: [], upcoming: [], completed: [] };
    trips.forEach(t => {
      if (t.end_date && t.end_date < today) grouped.completed.push(t);
      else if (t.start_date && t.start_date <= today) grouped.ongoing.push(t);
      else grouped.upcoming.push(t);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single trip (full itinerary)
// @route GET /api/trips/:id
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: fullTripInclude,
      order: [[Stop, 'order_index', 'ASC']]
    });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update trip
// @route PUT /api/trips/:id
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const { name, start_date, end_date } = req.body;
    if (name !== undefined && String(name).trim() === '') {
      return res.status(400).json({ message: 'Trip name cannot be empty' });
    }
    const sDate = start_date || trip.start_date;
    const eDate = end_date || trip.end_date;
    if (sDate && eDate && new Date(sDate) > new Date(eDate)) {
      return res.status(400).json({ message: 'End date must be greater than or equal to start date' });
    }

    const fields = ['name', 'description', 'start_date', 'end_date', 'cover_photo', 'status', 'is_public'];
    fields.forEach(f => { if (req.body[f] !== undefined) trip[f] = req.body[f]; });
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete trip
// @route DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const stops = await Stop.findAll({ where: { trip_id: trip.id }, attributes: ['id'] });
    const stopIds = stops.map(stop => stop.id);
    if (stopIds.length) {
      await StopActivity.destroy({ where: { stop_id: stopIds } });
      await Stop.destroy({ where: { id: stopIds } });
    }
    await trip.destroy();
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- ITINERARY BUILDER (Stops + Activities) ----------

// @desc Add a stop (section/city) to a trip
// @route POST /api/trips/:id/stops
const addStop = async (req, res) => {
  try {
    const trip = await Trip.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const { city_id, start_date, end_date, budget, order_index } = req.body;
    if (!city_id || !start_date || !end_date) {
      return res.status(400).json({ message: 'City, start date, and end date are required for a stop' });
    }
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ message: 'Stop end date must be greater than or equal to start date' });
    }
    if (new Date(start_date) < new Date(trip.start_date) || new Date(end_date) > new Date(trip.end_date)) {
      return res.status(400).json({ message: `Stop dates must be within the trip's date range (${trip.start_date} to ${trip.end_date})` });
    }
    const stop = await Stop.create({ trip_id: trip.id, city_id, start_date, end_date, budget: budget || 0, order_index: order_index || 0 });
    const full = await Stop.findByPk(stop.id, { include: [City] });
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStop = async (req, res) => {
  try {
    const stop = await Stop.findOne({
      where: { id: req.params.stopId },
      include: [{ model: Trip, where: { user_id: req.user.id } }]
    });
    if (!stop) return res.status(404).json({ message: 'Stop not found' });
    const { city_id, start_date, end_date, budget, order_index } = req.body;
    const sDate = start_date || stop.start_date;
    const eDate = end_date || stop.end_date;
    if (sDate && eDate && new Date(sDate) > new Date(eDate)) {
      return res.status(400).json({ message: 'Stop end date must be greater than or equal to start date' });
    }
    if (stop.Trip) {
      const t = stop.Trip;
      if (sDate && eDate && (new Date(sDate) < new Date(t.start_date) || new Date(eDate) > new Date(t.end_date))) {
        return res.status(400).json({ message: `Stop dates must be within the trip's date range (${t.start_date} to ${t.end_date})` });
      }
    }
    const fields = ['city_id', 'start_date', 'end_date', 'budget', 'order_index'];
    fields.forEach(f => { if (req.body[f] !== undefined) stop[f] = req.body[f]; });
    await stop.save();
    res.json(stop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findOne({
      where: { id: req.params.stopId },
      include: [{ model: Trip, where: { user_id: req.user.id } }]
    });
    if (!stop) return res.status(404).json({ message: 'Stop not found' });
    await stop.destroy();
    res.json({ message: 'Stop removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add activity to a stop (day-wise)
// @route POST /api/trips/stops/:stopId/activities
const addStopActivity = async (req, res) => {
  try {
    const stop = await Stop.findOne({
      where: { id: req.params.stopId },
      include: [{ model: Trip, where: { user_id: req.user.id } }]
    });
    if (!stop) return res.status(404).json({ message: 'Stop not found' });
    const { activity_id, day_number, time_slot, cost, notes, order_index } = req.body;
    const stopActivity = await StopActivity.create({
      stop_id: stop.id, activity_id, day_number: day_number || 1, time_slot, cost, notes, order_index: order_index || 0
    });
    const full = await StopActivity.findByPk(stopActivity.id, { include: [Activity] });
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteStopActivity = async (req, res) => {
  try {
    const sa = await StopActivity.findOne({
      where: { id: req.params.activityEntryId },
      include: [{ model: Stop, include: [{ model: Trip, where: { user_id: req.user.id } }] }]
    });
    if (!sa) return res.status(404).json({ message: 'Activity entry not found' });
    await sa.destroy();
    res.json({ message: 'Activity removed from itinerary' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- BUDGET BREAKDOWN ----------

// @desc Budget summary for a trip, grouped by category
// @route GET /api/trips/:id/budget
const getTripBudget = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: Stop,
        include: [{ model: StopActivity, include: [Activity] }, City]
      }]
    });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const breakdown = { sightseeing: 0, food: 0, adventure: 0, transport: 0, stay: 0, other: 0 };
    let total = 0;
    let stopsBudget = 0;

    trip.Stops.forEach(stop => {
      stopsBudget += parseFloat(stop.budget || 0);
      stop.StopActivities.forEach(sa => {
        const cat = sa.Activity ? sa.Activity.category : 'other';
        const cost = parseFloat(sa.cost || 0);
        breakdown[cat] = (breakdown[cat] || 0) + cost;
        total += cost;
      });
    });

    const days = trip.start_date && trip.end_date
      ? Math.max(1, (new Date(trip.end_date) - new Date(trip.start_date)) / 86400000 + 1)
      : 1;

    res.json({
      total_activity_cost: total,
      stops_budget_allocated: stopsBudget,
      grand_total: total + stopsBudget,
      average_per_day: (total + stopsBudget) / days,
      breakdown_by_category: breakdown,
      trip_days: days
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- PUBLIC SHARE ----------

// @desc Get public itinerary via share token (no auth)
// @route GET /api/trips/public/:token
const getPublicTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      where: { share_token: req.params.token, is_public: true },
      include: [
        { model: User, attributes: ['first_name', 'last_name', 'photo'] },
        { model: Stop, include: [City, { model: StopActivity, include: [Activity] }] }
      ]
    });
    if (!trip) return res.status(404).json({ message: 'Public itinerary not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTrip, getMyTrips, getTripById, updateTrip, deleteTrip,
  addStop, updateStop, deleteStop,
  addStopActivity, deleteStopActivity,
  getTripBudget, getPublicTrip
};
