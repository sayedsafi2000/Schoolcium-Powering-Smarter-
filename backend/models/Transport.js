const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  routeNumber: { type: String, unique: true },
  startLocation: String,
  endLocation: String,
  distance: Number,
  monthlyFee: Number,
  stops: [{
    stopName: String,
    stopLocation: String,
    sequence: Number,
    latitude: Number,
    longitude: Number
  }],
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: { type: Date, default: Date.now }
});

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ['Bus', 'Van', 'Car'], required: true },
  capacity: Number,
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'Active'
  },
  insuranceExpiry: Date,
  registrationExpiry: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  TransportRoute: mongoose.model('TransportRoute', transportRouteSchema),
  Vehicle: mongoose.model('Vehicle', vehicleSchema)
};

