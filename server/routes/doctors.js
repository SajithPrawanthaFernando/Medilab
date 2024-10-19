// routes/doctorRoutes.js
const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

// Add a new doctor
router.post('/', async (req, res) => {
  const {
    name,
    specialization,
    contact,
    status,
    consultantFee,
    visibilityStartDate,
    visibilityEndDate,
    visibilityStartTime,
    visibilityEndTime,
  } = req.body;

  const newDoctor = new Doctor({
    name,
    specialization,
    contact,
    status,
    consultantFee,
    visibilityStartDate,
    visibilityEndDate,
    visibilityStartTime,
    visibilityEndTime,
  });

  try {
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ message: 'Error adding doctor', error });
  }
});
router.get('/search', (req, res) => {
    console.log('Received request for search:', req.query.query);
    const query = req.query.query.toLowerCase();
    // Continue with the rest of your logic...
});
// Get doctor schedule (assuming each doctor has a schedule stored in their model)
router.get('/:doctorId/schedule', async (req, res) => {
    const { doctorId } = req.params;
    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        
        // Assuming doctor.schedule contains available time slots
        res.json(doctor.schedule); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedule' });
    }
});
// PUT (update) a doctor
router.put('/:id', async (req, res) => {
  const {
    name,
    specialization,
    contact,
    status,
    consultantFee,
    visibilityStartDate,
    visibilityEndDate,
    visibilityStartTime,
    visibilityEndTime,
  } = req.body;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        name,
        specialization,
        contact,
        status,
        consultantFee,
        visibilityStartDate,
        visibilityEndDate,
        visibilityStartTime,
        visibilityEndTime,
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

// DELETE a doctor
router.delete('/:id', async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});
module.exports = router;
