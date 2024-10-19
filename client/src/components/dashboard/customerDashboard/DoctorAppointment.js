import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom'; 
const DoctorAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [userDetails, setUserDetails] = useState({ name: '', contact: '' });
    const { user } = useAuthContext();
    const navigate = useNavigate();
    // Fetch all doctors on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/doctors');
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch doctors. Please try again later.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []); // Empty dependency array to run once on mount

    // Book appointment using Axios
    const handleBookAppointment = async () => {
        if (!isWithinVisibilityPeriod(appointmentDate, appointmentTime)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Appointment',
                text: "Please select a date and time within the doctor's visibility period.",
            });
            return;
        }

        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Not Logged In',
                text: 'User not logged in. Please log in to book an appointment.',
            });
            return;
        }

        // Validate userDetails
        if (!userDetails.name || !/^\d+$/.test(userDetails.contact)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Contact Number',
                text: 'Please enter a valid name and contact number.',
            });
            return;
        }

        const appointmentData = {
            doctorId: selectedDoctor._id,
            doctorName: selectedDoctor.name,
            userDetails,
            appointmentDate,
            appointmentTime,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/appointments',appointmentData);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Appointment booked successfully with Dr. ${selectedDoctor.name}!`,
                });
                resetAppointment();
               
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to book appointment. Please ensure all fields are filled correctly.',
            });
        }
    };

    const resetAppointment = () => {
        setIsBooking(false);
        setAppointmentDate('');
        setAppointmentTime('');
        setUserDetails({ name: '', contact: '' });
      
    };

    const isWithinVisibilityPeriod = (date, time) => {
        if (!selectedDoctor) return false;

        const selectedDate = new Date(date);
        const startDate = new Date(selectedDoctor.visibilityStartDate);
        const endDate = new Date(selectedDoctor.visibilityEndDate);
        const selectedTime = new Date(`1970-01-01T${time}:00`);
        const startTime = new Date(`1970-01-01T${selectedDoctor.visibilityStartTime}:00`);
        const endTime = new Date(`1970-01-01T${selectedDoctor.visibilityEndTime}:00`);

        return (
            selectedDate >= startDate &&
            selectedDate <= endDate &&
            selectedTime >= startTime &&
            selectedTime <= endTime
        );
    };

    return (
        <CustomerLayout>
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-semibold mb-6">Doctor List</h2>
                
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Specialization</th>
                                    <th className="py-3 px-6 text-left">Fee</th>
                                    <th className="py-3 px-6 text-left">Available Date</th>
                                    <th className="py-3 px-6 text-left">Available Time</th>
                                    <th className="py-3 px-6 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {doctors.map((doctor) => (
                                    <tr key={doctor._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6">{doctor.name}</td>
                                        <td className="py-3 px-6">{doctor.specialization}</td>
                                        <td className="py-3 px-6">${doctor.consultantFee}</td>
                                        <td className="py-3 px-6">
                                            {doctor.visibilityStartDate
                                                ? new Date(doctor.visibilityStartDate).toLocaleDateString()
                                                : 'N/A'} - <br />
                                            {doctor.visibilityEndDate
                                                ? new Date(doctor.visibilityEndDate).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="py-3 px-6">
                                            {doctor.visibilityStartTime || 'N/A'} - {doctor.visibilityEndTime || 'N/A'}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                                onClick={() => {
                                                    setSelectedDoctor(doctor);
                                                    setIsBooking(true);
                                                }}
                                                disabled={
                                                    !doctor.visibilityStartDate ||
                                                    !doctor.visibilityEndDate ||
                                                    !doctor.visibilityStartTime ||
                                                    !doctor.visibilityEndTime
                                                }
                                            >
                                                Book
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
             

                {isBooking && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl mb-4">Book Appointment</h2>
                            <div className="mb-4">
                                <label className="block mb-2">Select Date</label>
                                <input
    type="date"
    value={appointmentDate}
    onChange={(e) => setAppointmentDate(e.target.value)}
    className="border border-gray-300 p-2 rounded w-full"
    min={new Date().toISOString().split("T")[0]} // Prevent past dates
    required
/>
<div className="mb-4">
                                <label className="block mb-2">Select Time</label>
<input
    type="time"
    value={appointmentTime}
    onChange={(e) => setAppointmentTime(e.target.value)}
    className="border border-gray-300 p-2 rounded w-full"
    required
/>
</div>

                            </div>
                            
                            <div className="mb-4">
                                <label className="block mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={userDetails.name}
                                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    value={userDetails.contact}
                                    onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })}
                                    className="border border-gray-300 p-2 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleBookAppointment}
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={resetAppointment}
                                    className="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default DoctorAppointment;
