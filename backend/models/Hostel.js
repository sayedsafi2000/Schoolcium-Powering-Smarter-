const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  type: { type: String, enum: ['Boys', 'Girls', 'Mixed'], required: true },
  address: String,
  totalRooms: Number,
  occupiedRooms: Number,
  totalBeds: Number,
  occupiedBeds: Number,
  warden: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  facilities: [String],
  monthlyFee: Number,
  createdAt: { type: Date, default: Date.now }
});

const hostelRoomSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomNumber: { type: String, required: true },
  floor: Number,
  totalBeds: { type: Number, default: 2 },
  occupiedBeds: { type: Number, default: 0 },
  facilities: [String],
  status: { 
    type: String, 
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  }
});

module.exports = {
  Hostel: mongoose.model('Hostel', hostelSchema),
  HostelRoom: mongoose.model('HostelRoom', hostelRoomSchema)
};

