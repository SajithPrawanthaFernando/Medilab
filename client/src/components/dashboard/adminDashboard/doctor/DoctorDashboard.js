import React, { useState, useEffect } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";

const DoctorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    contact: "",
    status: "",
    consultantFee: "",
    visibilityStartDate: "",
    visibilityEndDate: "",
    visibilityStartTime: "",
    visibilityEndTime: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctor),
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors([...doctors, data]);
        setIsAddingDoctor(false);
        resetForm();
      } else {
        console.error("Failed to add doctor");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctors/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDoctors(doctors.filter((doctor) => doctor._id !== id));
      } else {
        console.error("Failed to delete doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleEditDoctor = (doctor) => {
    setNewDoctor(doctor);
    setSelectedDoctorId(doctor._id);
    setIsEditingDoctor(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/doctors/${selectedDoctorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDoctor),
        }
      );

      if (response.ok) {
        const updatedDoctor = await response.json();
        setDoctors(
          doctors.map((doctor) =>
            doctor._id === selectedDoctorId ? updatedDoctor : doctor
          )
        );
        setIsEditingDoctor(false);
        resetForm();
      } else {
        console.error("Failed to update doctor");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const resetForm = () => {
    setNewDoctor({
      name: "",
      specialization: "",
      contact: "",
      status: "",
      consultantFee: "",
      visibilityStartDate: "",
      visibilityEndDate: "",
      visibilityStartTime: "",
      visibilityEndTime: "",
    });
  };

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg  mx-1 my-2 h-full  shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="bg-white p-6 rounded-lg  mt-6">
          <h1 className="text-2xl font-semibold mb-4">All Doctors</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setIsAddingDoctor(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md text-xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Doctor List Table */}
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-2 px-3 text-left text-xs">Name</th>
                <th className="py-2 px-3 text-left text-xs">Specialization</th>
                <th className="py-2 px-3 text-left text-xs">Contact</th>
                <th className="py-2 px-3 text-left text-xs">Status</th>
                <th className="py-2 px-3 text-left text-xs">Consultant Fee</th>
                <th className="py-2 px-3 text-left text-xs">Start Date</th>
                <th className="py-2 px-3 text-left text-xs">Start Time</th>
                <th className="py-2 px-3 text-left text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {doctors
                .filter((doctor) =>
                  doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2 px-3 text-xs">{doctor.name}</td>
                    <td className="py-2 px-3 text-xs">
                      {doctor.specialization}
                    </td>
                    <td className="py-2 px-3 text-xs">{doctor.contact}</td>
                    <td className="py-2 px-3 text-xs">{doctor.status}</td>
                    <td className="py-2 px-3 text-xs">
                      LKR{doctor.consultantFee}
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {doctor.visibilityStartDate
                        ? new Date(
                            doctor.visibilityStartDate
                          ).toLocaleDateString()
                        : "N/A"}
                      -{" "}
                      {doctor.visibilityEndDate
                        ? new Date(
                            doctor.visibilityEndDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {doctor.visibilityStartTime || "N/A"}-
                      {doctor.visibilityEndTime || "N/A"}
                    </td>
                    <td className="py-2 px-3 text-xs">
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="bg-green-400 text-white py-1 px-2 rounded-md mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor._id)}
                        className="bg-red-500 text-white py-1 px-2 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Add Doctor Form */}
          {isAddingDoctor && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
                <form
                  onSubmit={handleAddDoctor}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="doctorName"
                      className="block mb-1 text-sm font-medium"
                    >
                      Name
                    </label>
                    <input
                      id="doctorName"
                      type="text"
                      placeholder="Name"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.name}
                      onChange={(e) =>
                        setNewDoctor({ ...newDoctor, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Specialization Field */}
                  <div>
                    <label
                      htmlFor="specialization"
                      className="block mb-1 text-sm font-medium"
                    >
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      type="text"
                      placeholder="Specialization"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.specialization}
                      onChange={(e) =>
                        setNewDoctor({
                          ...newDoctor,
                          specialization: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Contact Field */}
                  <div>
                    <label
                      htmlFor="contact"
                      className="block mb-1 text-sm font-medium"
                    >
                      Contact
                    </label>
                    <input
                      id="contact"
                      type="text"
                      placeholder="Contact"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.contact}
                      onChange={(e) =>
                        setNewDoctor({ ...newDoctor, contact: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Status Field */}
                  <div>
                    <label
                      htmlFor="status"
                      className="block mb-1 text-sm font-medium"
                    >
                      Status
                    </label>
                    <input
                      id="status"
                      type="text"
                      placeholder="Status"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.status}
                      onChange={(e) =>
                        setNewDoctor({ ...newDoctor, status: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Consultant Fee Field */}
                  <div>
                    <label
                      htmlFor="consultantFee"
                      className="block mb-1 text-sm font-medium"
                    >
                      Consultant Fee
                    </label>
                    <input
                      id="consultantFee"
                      type="number"
                      placeholder="Consultant Fee"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.consultantFee}
                      onChange={(e) =>
                        setNewDoctor({
                          ...newDoctor,
                          consultantFee: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Visibility Start Date Field */}
                  <div>
                    <label
                      htmlFor="visibilityStartDate"
                      className="block mb-1 text-sm font-medium"
                    >
                      Visibility Start Date
                    </label>
                    <input
                      id="visibilityStartDate"
                      type="date"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.visibilityStartDate}
                      onChange={(e) =>
                        setNewDoctor({
                          ...newDoctor,
                          visibilityStartDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Visibility End Date Field */}
                  <div>
                    <label
                      htmlFor="visibilityEndDate"
                      className="block mb-1 text-sm font-medium"
                    >
                      Visibility End Date
                    </label>
                    <input
                      id="visibilityEndDate"
                      type="date"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.visibilityEndDate}
                      onChange={(e) =>
                        setNewDoctor({
                          ...newDoctor,
                          visibilityEndDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Visibility Start Time Field */}
                  <div>
                    <label
                      htmlFor="visibilityStartTime"
                      className="block mb-1 text-sm font-medium"
                    >
                      Visibility Start Time
                    </label>
                    <input
                      id="visibilityStartTime"
                      type="time"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.visibilityStartTime}
                      onChange={(e) =>
                        setNewDoctor({
                          ...newDoctor,
                          visibilityStartTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Visibility End Time Field */}
                  <div>
                    <label
                      htmlFor="visibilityEndTime"
                      className="block mb-1 text-sm font-medium"
                    >
                      Visibility End Time
                    </label>
                    <input
                      id="visibilityEndTime"
                      type="time"
                      className="block w-full mb-2 p-2 border rounded-md text-xs"
                      value={newDoctor.visibilityEndTime}
                      onChange={(e) =>
                        setNewDoctor({
                          ...newDoctor,
                          visibilityEndTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-4 col-span-2">
                    <button
                      type="button"
                      className="bg-gray-500 text-white py-2 px-4 rounded-md text-xs"
                      onClick={() => setIsAddingDoctor(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded-md text-xs"
                    >
                      Add Doctor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {/* Edit Doctor Form */}
        {isEditingDoctor && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Edit Doctor</h2>
              <form
                onSubmit={handleUpdateDoctor}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="doctorName"
                    className="block mb-1 text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    id="doctorName"
                    type="text"
                    placeholder="Name"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.name}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Specialization Field */}
                <div>
                  <label
                    htmlFor="specialization"
                    className="block mb-1 text-sm font-medium"
                  >
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    placeholder="Specialization"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.specialization}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        specialization: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Contact Field */}
                <div>
                  <label
                    htmlFor="contact"
                    className="block mb-1 text-sm font-medium"
                  >
                    Contact
                  </label>
                  <input
                    id="contact"
                    type="text"
                    placeholder="Contact"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.contact}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, contact: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Status Field */}
                <div>
                  <label
                    htmlFor="status"
                    className="block mb-1 text-sm font-medium"
                  >
                    Status
                  </label>
                  <input
                    id="status"
                    type="text"
                    placeholder="Status"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.status}
                    onChange={(e) =>
                      setNewDoctor({ ...newDoctor, status: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Consultant Fee Field */}
                <div>
                  <label
                    htmlFor="consultantFee"
                    className="block mb-1 text-sm font-medium"
                  >
                    Consultant Fee
                  </label>
                  <input
                    id="consultantFee"
                    type="number"
                    placeholder="Consultant Fee"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.consultantFee}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        consultantFee: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Visibility Start Date Field */}
                <div>
                  <label
                    htmlFor="visibilityStartDate"
                    className="block mb-1 text-sm font-medium"
                  >
                    Visibility Start Date
                  </label>
                  <input
                    id="visibilityStartDate"
                    type="date"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.visibilityStartDate} // Ensure this is correctly set
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        visibilityStartDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Visibility End Date Field */}
                <div>
                  <label
                    htmlFor="visibilityEndDate"
                    className="block mb-1 text-sm font-medium"
                  >
                    Visibility End Date
                  </label>
                  <input
                    id="visibilityEndDate"
                    type="date"
                    className="block w-full mb-2 p-2 border rounded-md text-xs"
                    value={newDoctor.visibilityEndDate}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        visibilityEndDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Visibility Start Time Field */}
                <div>
                  <label
                    htmlFor="visibilityStartTime"
                    className="block mb-1 text-sm font-medium"
                  >
                    Visibility Start Time
                  </label>
                  <input
                    id="visibilityStartTime"
                    type="time"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.visibilityStartTime}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        visibilityStartTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Visibility End Time Field */}
                <div>
                  <label
                    htmlFor="visibilityEndTime"
                    className="block mb-1 text-sm font-medium"
                  >
                    Visibility End Time
                  </label>
                  <input
                    id="visibilityEndTime"
                    type="time"
                    className="block w-full p-2 border rounded-md text-xs"
                    value={newDoctor.visibilityEndTime}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        visibilityEndTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 col-span-2">
                  <button
                    type="button"
                    className="bg-gray-500 text-white py-2 px-4 rounded-md text-xs"
                    onClick={() => setIsEditingDoctor(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md text-xs"
                  >
                    Update Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DoctorDashboard;
