const express = require('express');
const { TransportRoute, Vehicle } = require('../models/Transport');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/routes', auth, async (req, res) => {
  try {
    const routes = await TransportRoute.find()
      .populate('vehicle')
      .populate('driver');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/routes', auth, async (req, res) => {
  try {
    const route = new TransportRoute(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Vehicles
router.get('/vehicles', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('driver')
      .populate('conductor');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/vehicles', auth, async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

