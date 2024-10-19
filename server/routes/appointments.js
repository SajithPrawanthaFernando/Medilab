const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose'); 
const { check, validationResult } = require('express-validator');
// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctorId', 'name specialization');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.id });
        if (!appointments) return res.status(404).send('No appointments found');
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Book an appointment

router.post(
    '/',
    [
       
        check('appointmentDate').notEmpty().withMessage('Appointment date is required.'),
        check('appointmentTime').notEmpty().withMessage('Appointment time is required.'),
        check('userDetails').notEmpty().withMessage('User details are required.'),
       
    ],
    async (req, res) => {
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { doctorId,doctorName,appointmentDate, appointmentTime, userDetails, userId } = req.body;

        try {
            // Create new appointment
            const newAppointment = new Appointment({
                userId,
                doctorName,
                userDetails,
                appointmentDate,
                appointmentTime,
            });

            await newAppointment.save(); // Save to the database
            res.status(201).json({
                message: 'Appointment booked successfully!',
                appointment: newAppointment
            });
        } catch (error) {
            console.error('Error creating appointment:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }
);


// Approve an appointment
// Approve an appointment
router.put('/:id/approve', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = 'Approved';
        await appointment.save();

        // Notify customer (replace this with your notification logic)
        console.log(`Notification sent to ${appointment.userDetails.name}: Your appointment has been approved!`);

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Cancel an appointment with a reason
router.put('/:id/cancel', async (req, res) => {
    const { reason } = req.body; // Get cancellation reason from request body
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = 'Cancelled';
        await appointment.save();

        // Notify customer with reason
        console.log(`Notification sent to ${appointment.userDetails.name}: Your appointment has been cancelled. Reason: ${reason}`);

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/api/bookingmessages', async (req, res) => {
    const { userId, message } = req.body;

    try {
        const newMessage = await Message.create({ userId, message });
        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
module.exports = router;
