const express = require('express');
const { Hostel, HostelRoom } = require('../models/Hostel');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Hostels
router.get('/hostels', auth, async (req, res) => {
  try {
    const hostels = await Hostel.find().populate('warden');
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/hostels', auth, async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    await hostel.save();
    res.status(201).json(hostel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const { hostelId } = req.query;
    const query = hostelId ? { hostelId } : {};
    const rooms = await HostelRoom.find(query).populate('hostelId');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/rooms', auth, async (req, res) => {
  try {
    const room = new HostelRoom(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Allocate room
router.post('/allocate', auth, async (req, res) => {
  try {
    const { studentId, roomId, bedNumber } = req.body;
    const room = await HostelRoom.findById(roomId);
    
    if (!room || room.occupiedBeds >= room.totalBeds) {
      return res.status(400).json({ message: 'Room not available' });
    }
    
    room.occupiedBeds += 1;
    if (room.occupiedBeds === room.totalBeds) {
      room.status = 'Occupied';
    }
    await room.save();
    
    // Update student record
    const Student = require('../models/Student');
    await Student.findByIdAndUpdate(studentId, {
      'hostel.roomId': roomId,
      'hostel.bedNumber': bedNumber
    });
    
    res.json({ message: 'Room allocated successfully', room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

