import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState("");

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Error fetching appointments:"); // Add this line
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Approve an appointment
  const approveAppointment = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}/approve`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        alert("Appointment approved!");
        fetchAppointments(); // Refresh the list
      } else {
        alert("Failed to approve appointment.");
      }
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const cancelAppointment = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${currentAppointmentId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: cancelReason }),
        }
      );

      if (response.ok) {
        alert("Appointment cancelled!"); // Success message

        // Continue with sending cancellation reason to user's messages
        const appointmentResponse = await fetch(
          `http://localhost:5000/api/appointments/${currentAppointmentId}`
        );
        const appointmentData = await appointmentResponse.json();

        const messageResponse = await fetch(
          "http://localhost:5000/api/bookingmessages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: appointmentData.userId,
              message: `Your appointment has been cancelled. Reason: ${cancelReason}`,
            }),
          }
        );

        if (!messageResponse.ok) {
          console.error("Failed to send message to user.");
        }

        fetchAppointments(); // Refresh the list
        setCancelReason(""); // Reset reason
        handleClose(); // Close dialog
      } else {
        alert("Failed to cancel appointment."); // Failure message
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment."); // Alert on error
    }
  };

  // Open cancel dialog
  const handleClickOpen = (id) => {
    setCurrentAppointmentId(id);
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setCancelReason(""); // Reset reason
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg mx-1 my-2  shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="bg-white p-4 rounded-lg mt-6">
          <h1 className="text-xl font-semibold mb-4">All Appointments</h1>
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-600 uppercase text-sm leading-normal py-2">
                <th className="py-2 px-3 text-left">User Name</th>
                <th className="py-2 px-3 text-left">Doctor Name</th>
                <th className="py-2 px-3 text-left">Appointment Date</th>
                <th className="py-2 px-3 text-left">Appointment Time</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="py-2 px-3 text-sm">
                    {appointment.userDetails?.name || "N/A"}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {appointment.doctorName}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {appointment.appointmentDate}
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {appointment.appointmentTime}
                  </td>
                  <td className="py-2 px-3 text-sm">{appointment.status}</td>
                  <td className="py-2 px-3 text-sm">
                    {appointment.status === "Pending" && (
                      <>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-1 text-xs"
                          onClick={() => approveAppointment(appointment._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleClickOpen(appointment._id)} // Open cancel dialog
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cancel Dialog */}
          {open && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                  Cancel Appointment
                </h2>
                <input
                  type="text"
                  className="border p-1 w-full mb-4"
                  placeholder="Cancellation Reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleClose}
                    className="bg-gray-300 text-black px-2 py-1 rounded mr-1 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={cancelAppointment}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppointmentDashboard;
